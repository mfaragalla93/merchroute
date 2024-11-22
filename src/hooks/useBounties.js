import { bounties } from "../algorithm/bounties.js";
import { useEffect, useMemo, useState } from "react";

const defaultBountyState = Object.fromEntries(
  Object.entries(bounties).map(([key, value]) => [
    key,
    {
      name: value.name,
      selectedCount: 0,
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

  const selectedBounties = useMemo(() => {
    return bounties.filter((bounty) => bounty.selectedCount > 0);
  }, [bounties]);

  const selectedBountiesCount = useMemo(() => {
    return selectedBounties.reduce(
      (acc, bounty) => acc + bounty.selectedCount,
      0,
    );
  }, [selectedBounties]);

  const setCount = (key, value) => {
    if (selectedBountiesCount === 6 && bountyObj[key].selectedCount < value) {
      return;
    }

    setBountyObj((bountyObj) => ({
      ...bountyObj,
      [key]: {
        ...bountyObj[key],
        selectedCount: value,
      },
    }));
  };

  const reset = () => {
    setBountyObj(defaultBountyState);
  };

  return {
    bounties,
    selectedBounties,
    selectedBountiesCount,
    setCount,
    reset,
  };
};

export default useBounties;
