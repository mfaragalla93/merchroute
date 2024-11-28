import { bounties } from "../algorithm/bounties.js";
import { useEffect, useMemo, useState } from "react";
import { bountyBoard } from "../algorithm/nodes.js";

const defaultBountyState = Object.fromEntries(
  Object.entries(bounties).map(([key, value]) => [
    key,
    {
      name: value.name,
      count: 0,
      bountyBoard: false,
    },
  ]),
);

const useBounties = (key) => {
  const [bountyObj, setBountyObj] = useState(() => {
    const bountyJson = sessionStorage.getItem(key);
    if (bountyJson) {
      return JSON.parse(sessionStorage.getItem(key));
    }

    return defaultBountyState;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(bountyObj));
  }, [key, bountyObj]);

  const bounties = useMemo(() => {
    return Object.keys(bountyObj).map((key) => ({
      key,
      ...bountyObj[key],
    }));
  }, [bountyObj]);

  const selected = useMemo(() => {
    return bounties.filter((bounty) => bounty.count > 0);
  }, [bounties]);

  const count = useMemo(() => {
    return selected.reduce((acc, bounty) => acc + bounty.count, 0);
  }, [selected]);

  const bountyBoard = useMemo(() => {
    return bounties.filter((bounty) => bounty.bountyBoard);
  }, [bounties]);

  const bountyBoardCount = useMemo(() => {
    return bountyBoard.reduce(
      (acc, bounty) => (bounty.bountyBoard ? acc + 1 : acc),
      0,
    );
  }, [bountyBoard]);

  const setCount = (key, value) => {
    if (count === 6 && bountyObj[key].count < value) {
      return;
    }

    setBountyObj((bountyObj) => ({
      ...bountyObj,
      [key]: {
        ...bountyObj[key],
        count: value,
      },
    }));
  };

  const toggleBountyBoard = (key, checked) => {
    setBountyObj((bountyObj) => ({
      ...bountyObj,
      [key]: {
        ...bountyObj[key],
        bountyBoard: checked,
      },
    }));
  };

  const increment = (key) => {
    setCount(key, bountyObj[key].count + 1);
  };

  const decrement = (key) => {
    setCount(key, bountyObj[key].count - 1);
  };

  const resetBounties = () => {
    setBountyObj((bountyObj) =>
      Object.fromEntries(
        Object.entries(bountyObj).map(([key, value]) => [
          key,
          {
            ...value,
            count: 0,
          },
        ]),
      ),
    );
  };

  const resetBountyBoard = () => {
    setBountyObj((bountyObj) =>
      Object.fromEntries(
        Object.entries(bountyObj).map(([key, value]) => [
          key,
          {
            ...value,
            bountyBoard: false,
          },
        ]),
      ),
    );
  };

  return {
    bounties,
    selected,
    count,
    bountyBoard,
    bountyBoardCount,
    increment,
    decrement,
    toggleBountyBoard,
    resetBounties,
    resetBountyBoard,
  };
};

export default useBounties;
