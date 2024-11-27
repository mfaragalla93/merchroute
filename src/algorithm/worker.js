import pathfinder from "./pathfinder.js";

/**
 * Background thread for processing. This is used to not block the main thread and cause the UI to freeze.
 *
 * This just wraps the pathfinder function and should not contain any additional logic.
 * @param event Event data passed as parameters to {@link pathfinder.findBestBounties}.
 */
onmessage = (event) => {
  const {
    currentBounties,
    availableBounties,
    detectiveLevel,
    battleOfFortuneholdCompleted,
    roundTrip,
  } = event.data;

  const result = pathfinder.findBestBounties(
    currentBounties,
    availableBounties,
    detectiveLevel,
    battleOfFortuneholdCompleted,
    roundTrip,
  );

  postMessage(result);
};
