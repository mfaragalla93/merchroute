import { useMemo } from "react";
import { bounties } from "../algorithm/bounties.js";

const Bounty = ({ bountyKey }) => {
  const bounty = useMemo(() => {
    return bounties[bountyKey];
  }, [bountyKey]);

  if (!bounty) {
    return null;
  }

  return (
    <div className="inline-block rounded px-1.5 dark:text-zinc-200">
      <div className="flex items-center">
        <img
          width={25}
          height={25}
          src={`https://brightershoreswiki.org/images/${bounty.name.replace(/ /g, "_")}.png`}
          onError={(e) => (e.currentTarget.src = "/unknown-transparent.jpg")}
          alt={bounty.name}
          className="rounded-md"
        />
        <div className="ml-1">{bounty.name}</div>
      </div>
    </div>
  );
};

export default Bounty;
