import { PriorityQueue } from "@datastructures-js/priority-queue";

import GPS from "./gps.js";
import combinations from "./combinations.js";
import { BountyStatus } from "./bounties.js";
import { bountyBoard, portals } from "./nodes.js";
import { bounties as bountyData } from "./bounties.js";

/**
 * Determines the best route to take to make all deliveries
 */
class Pathfinder {
  includeTeleportSteps = true; // Whether to include teleport steps in the path
  includeWalkingSteps = false; // Whether to include walking steps in the path
  inventorySpace = 24; // The maximum number of items that can be carried at once
  timeToBuy = 3; // The time in seconds it takes to buy an item
  timeToSell = 4; // The time in seconds it takes to sell an item

  /**
   * Determines which deliveries should be made based on current and available deliveries
   * @param currentBounties An array of keys from {@link bountyData}
   *   These are be the bounties the player has already accepted
   *   E.g, [CARROTS, SOAP, ...]
   * @param availableBounties (Optional) An array of keys from {@link bountyData}
   *   These are the bounties the player has available but not yet accepted on the bounty board
   *   E.g, [CARROTS, SOAP, ...]
   * @param detectiveLevel Level of players Detective skill, used to determine any additional rooms which can be accessed
   * @param battleOfFortuneholdCompleted Whether the player has completed the Battle of Fortunehold quest which unlocks an additional room
   * @returns {
   *     {bounties: string[]},    // An array of keys from {@link bountyData} representing the best bounties to complete
   *     {actions:    string[]},  // An array of actions to take to complete the deliveries
   *     {distance:   number}     // The total distance (time in seconds) it will take to complete the bounties
   * }
   */
  findBestBounties(
    currentBounties,
    availableBounties,
    detectiveLevel,
    battleOfFortuneholdCompleted,
  ) {
    const result = {
      bounties: [],
      actions: [],
      distance: Number.MAX_SAFE_INTEGER,
      experience: 0,
    };

    const gps = new GPS(detectiveLevel, battleOfFortuneholdCompleted);

    const allBounties = [...currentBounties, ...availableBounties];
    const combos = combinations(allBounties, Math.min(allBounties.length, 6));

    // Sort the combinations by the number of overlapping merchants that they have.
    // This is done because the best combination is likely to have more overlapping merchants.
    // By finding the best combination early on, we cut down on the number of routes that need to be calculated.
    combos.sort(
      (combo1, combo2) =>
        this.#getNumOverlappingMerchants(combo2) -
        this.#getNumOverlappingMerchants(combo1),
    );

    const startTimestamp = Date.now();
    console.log(`Finding best route amongst ${combos.length} possibilities`);

    combos.forEach((combo) => {
      const experience = combo.reduce(
        (acc, bounty) => acc + bountyData[bounty].exp,
        0,
      );

      const route = this.findBestRoute(combo, gps, result.distance);
      if (route === null) {
        // Route was not shorter than the current best
        return;
      }

      result.distance = route.distance;
      result.bounties = combo;
      result.actions = route.actions;
      result.experience = experience;
    });

    console.log(`Best route found in ${Date.now() - startTimestamp}ms`);
    return result;
  }

  /**
   * Determines the shortest route to complete all deliveries
   * @param bounties An array containing bounties {@link bountyData}. E.g, [CARROTS, SOAP, ...]
   * @param gps An instance of the GPS class
   * @param threshold This method will "give up" on paths that are longer than this distance
   * @returns {{actions: string[], distance: number} | null}
   *  Returns an object containing the actions to take and the total distance
   *  Returns null if no route is found that is shorter than the threshold
   */
  findBestRoute(bounties, gps, threshold = Number.MAX_SAFE_INTEGER) {
    const pq = new PriorityQueue((a, b) => a.distance - b.distance);
    const visited = new Map();

    pq.enqueue({
      distance: 0,
      previousNode: null,
      currentNode: bountyBoard.node,
      bountyStates: [...new Array(bounties.length)].map(
        () => BountyStatus.NOT_STARTED,
      ),
      actions: [],
    });

    while (pq.size() > 0) {
      const {
        distance,
        previousNode,
        currentNode,
        bountyStates: originalBountyStates,
        actions: originalActions,
      } = pq.dequeue();

      // Avoid mutating the original arrays by creating copies
      const bountyStates = [...originalBountyStates];
      const actions = [...originalActions];

      // Check if we have already found a shorter path to this location with the same deliveries
      const visitedKey = `${currentNode}-${bountyStates}`;
      if (visited.has(visitedKey) && visited.get(visitedKey) <= distance) {
        continue;
      }
      visited.set(visitedKey, distance);

      let distanceAfterTrading = distance;
      let numItemsBought = 0;
      let numItemsSold = 0;

      // Sell everything we can at the current location
      // It is important to sell items before purchasing to free up inventory space
      for (let i = 0; i < bounties.length; i++) {
        const bounty = bounties[i];
        if (currentNode !== bountyData[bounty].buyer.node) {
          continue;
        }

        if (bountyStates[i] !== BountyStatus.IN_PROGRESS) {
          continue;
        }

        if (numItemsBought + numItemsSold === 0) {
          this.#addTravelSteps(gps, actions, previousNode, currentNode);
        }

        numItemsSold += 1;
        distanceAfterTrading += this.timeToSell;

        actions.push({
          type: "sell",
          item: bounty,
          location: bountyData[bounty].buyer.name,
          distance: distanceAfterTrading,
        });
        bountyStates[i] = BountyStatus.COMPLETED;
      }

      // Buy everything we can at the current location
      for (let i = 0; i < bounties.length; i++) {
        if (!this.#canPurchaseMoreItems(bountyStates)) {
          break;
        }

        const bounty = bounties[i];
        if (currentNode !== bountyData[bounty].seller.node) {
          continue;
        }

        if (bountyStates[i] !== BountyStatus.NOT_STARTED) {
          continue;
        }

        if (numItemsBought + numItemsSold === 0) {
          this.#addTravelSteps(gps, actions, previousNode, currentNode);
        }

        if (numItemsBought === 0) {
          distanceAfterTrading += this.timeToBuy; // Buying more than one item takes no extra time
        }
        numItemsBought += 1;

        actions.push({
          type: "buy",
          item: bounty,
          location: bountyData[bounty].seller.name,
          distance: distanceAfterTrading,
        });
        bountyStates[i] = BountyStatus.IN_PROGRESS;
      }

      // Give up on paths that are too long
      if (distanceAfterTrading > threshold) {
        return null;
      }

      if (this.#deliveriesCompleted(bountyStates)) {
        return { actions, distance: distanceAfterTrading };
      }

      // Enqueue next purchase locations
      if (this.#canPurchaseMoreItems(bountyStates)) {
        bounties
          .filter((b, i) => bountyStates[i] === BountyStatus.NOT_STARTED)
          .forEach((bounty) => {
            const nextNode = bountyData[bounty].seller.node;
            const { distance: nextDistance } = gps.distance(
              currentNode,
              nextNode,
            );
            pq.enqueue({
              distance: distanceAfterTrading + nextDistance,
              previousNode: currentNode,
              currentNode: nextNode,
              bountyStates,
              actions,
            });
          });
      }

      // Enqueue next sell locations
      bounties
        .filter((d, i) => bountyStates[i] === BountyStatus.IN_PROGRESS)
        .forEach((bounty) => {
          const nextNode = bountyData[bounty].buyer.node;
          const { distance: nextDistance } = gps.distance(
            currentNode,
            nextNode,
          );
          pq.enqueue({
            distance: distanceAfterTrading + nextDistance,
            previousNode: currentNode,
            currentNode: nextNode,
            bountyStates,
            actions,
          });
        });
    }
  }

  /**
   * Determines the number of overlapping merchants in a list of bounties
   * For example, [CARROTS, CARROTS] would have two overlapping merchants (GREENGROCERS & TOY_STALL)
   * While [CARROTS, PORCELAIN_DOLL] would have one overlapping merchant (TOY_STALL)
   * @param bounties An array of bounty keys
   * @returns {number} The number of overlapping merchants
   */
  #getNumOverlappingMerchants = (bounties) => {
    let result = 0;
    const merchants = new Set();

    for (const bounty of bounties) {
      const buy = bountyData[bounty].buyer.node;
      const sell = bountyData[bounty].seller.node;

      if (merchants.has(buy)) {
        result += 1;
      } else {
        merchants.add(buy);
      }

      if (merchants.has(sell)) {
        result += 1;
      } else {
        merchants.add(sell);
      }
    }

    return result;
  };

  /**
   * Updates the actions array with individual steps to take to get from one location to another
   * @param gps An instance of the GPS class
   * @param actions An array of actions
   * @param startNode Node of the starting location (reference {@link edges})
   * @param endNode Name of the ending location, (reference {@link edges})
   */
  #addTravelSteps(gps, actions, startNode, endNode) {
    const { path } = gps.distance(startNode, endNode);
    if (path.length < 2) {
      return;
    }

    const currentDistance =
      actions.length > 0 ? actions[actions.length - 1].distance : 0;

    for (let i = 1; i < path.length - 1; i++) {
      if (
        this.includeTeleportSteps &&
        path[i] === portals.CRENOPOLIS_MARKET.node
      ) {
        actions.push({
          type: "teleport",
          location: portals.CRENOPOLIS_MARKET.name,
          distance: currentDistance + portals.CRENOPOLIS_MARKET.teleportTime,
        });
      } else if (
        this.includeTeleportSteps &&
        path[i] === portals.CRENOPOLIS_OUTSKIRTS.node
      ) {
        actions.push({
          type: "teleport",
          location: portals.CRENOPOLIS_OUTSKIRTS.name,
          distance: currentDistance + portals.CRENOPOLIS_OUTSKIRTS.teleportTime,
        });
      } else if (this.includeWalkingSteps) {
        actions.push({
          type: "walk",
          location: path[i],
        });
      }
    }
  }

  /**
   * Determines if more items can be purchased / carried in the inventory
   * @param bountyStates An array of {@link BountyStatus} values representing the state of each bounty
   * @returns {boolean} True if more items can be purchased, false otherwise
   */
  #canPurchaseMoreItems(bountyStates) {
    let availableSpace = this.inventorySpace;

    for (const state of bountyStates) {
      if (state === BountyStatus.IN_PROGRESS) {
        availableSpace -= 6;
      }
    }

    return availableSpace >= 6;
  }

  /**
   * Determines if all deliveries have been completed
   * @param bountyStates An array of {@link BountyStatus} values representing the state of each bounty
   * @returns {boolean} True if all deliveries have been completed, false otherwise
   */
  #deliveriesCompleted(bountyStates) {
    return bountyStates.every((state) => state === BountyStatus.COMPLETED);
  }
}

export default new Pathfinder();
