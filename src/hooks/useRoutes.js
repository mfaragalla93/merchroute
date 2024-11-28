import { useEffect, useState } from "react";
import useBounties from "./useBounties.js";
import useSettings from "./useSettings.js";

const worker = new Worker(new URL("../algorithm/worker.js", import.meta.url), {
  type: "module",
});

const useRoutes = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const { selected, bountyBoard, count, bountyBoardCount } =
    useBounties("bountiesV3");
  const { detectiveLevel, battleOfFortuneholdCompleted, roundTrip } =
    useSettings();

  useEffect(() => {
    worker.onmessage = (event) => {
      console.log("result", event.data);
      setResults(event.data);
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    if (count + bountyBoardCount === 0) {
      setLoading(false);
      return;
    }

    setResults([]);
    setLoading(true);

    const keys = [];
    selected.forEach((bounty) => {
      for (let i = 0; i < bounty.count; i++) {
        keys.push(bounty.key);
      }
    });
    bountyBoard.forEach((bounty) => {
      keys.push(bounty.key);
    });

    const message = {
      bounties: keys,
      detectiveLevel: detectiveLevel === "" ? 0 : detectiveLevel,
      battleOfFortuneholdCompleted,
      roundTrip,
    };

    console.log("message", message);

    worker.postMessage(message);
  }, [selected, detectiveLevel, battleOfFortuneholdCompleted, roundTrip]);

  return { loading, results };
};

export default useRoutes;
