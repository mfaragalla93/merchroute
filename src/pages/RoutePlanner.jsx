import useBounties from "../hooks/useBounties.js";
import Page from "../components/Page.jsx";
import { useEffect, useMemo, useState } from "react";
import Bounty from "../components/Bounty.jsx";
import Subheading from "../components/Subheading.jsx";
import useSettings from "../hooks/useSettings.js";
import Paragraph from "../components/Paragraph.jsx";
import InternalLink from "../components/InternalLink.jsx";

const worker = new Worker(new URL("../algorithm/worker.js", import.meta.url), {
  type: "module",
});

const formatTime = (input) => {
  let seconds = parseInt(input, 10);
  if (isNaN(seconds)) {
    return input; // In case the input is not a valid number.
  }

  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

const RoutePlanner = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({});

  const { selectedBounties: bounties } = useBounties("bounties");
  const { selectedBounties: availableBounties } =
    useBounties("availableBounties");

  const { detectiveLevel, battleOfFortuneholdCompleted } = useSettings();

  useEffect(() => {
    worker.onmessage = (event) => {
      console.log("result", event.data);
      setResult(event.data);
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    if (bounties.length + availableBounties.length === 0) {
      return;
    }

    setResult({});
    setLoading(true);

    const message = {
      currentBounties: bounties.map((bounty) => bounty.key),
      availableBounties: availableBounties.map((bounty) => bounty.key),
      detectiveLevel: detectiveLevel === "" ? 0 : detectiveLevel,
      battleOfFortuneholdCompleted,
    };

    console.log("message", message);

    worker.postMessage(message);
  }, [
    bounties,
    availableBounties,
    detectiveLevel,
    battleOfFortuneholdCompleted,
  ]);

  const bountiesToAbandon = useMemo(() => {
    if (Object.keys(result).length === 0) {
      return null;
    }

    const bountiesToAbandon = bounties
      .filter((bounty) => !result.bounties.includes(bounty.key))
      .map((bounty) => bounty.key);

    console.log("bountiesToAbandon", bountiesToAbandon);
    return bountiesToAbandon;
  }, [bounties, result]);

  const bountiesToPickup = useMemo(() => {
    if (Object.keys(result).length === 0) {
      return null;
    }

    let bountiesToPickup = [];
    let keys = bounties.map((bounty) => bounty.key);
    result.bounties.forEach((key) => {
      if (keys.includes(key)) {
        keys = keys.filter((k) => k !== key);
      } else {
        bountiesToPickup.push(key);
      }
    });

    console.log("bountiesToPickup", bountiesToPickup);
    return bountiesToPickup;
  }, [bounties, result]);

  return (
    <Page title="Bounty Plan" meta="The best route based on your selections.">
      {!bounties.length && !availableBounties.length ? (
        <div>
          <Paragraph>
            You have not selected any bounties yet. Please{" "}
            <InternalLink to="/select-bounties">select bounties</InternalLink>{" "}
            to get started.
          </Paragraph>
        </div>
      ) : null}

      {(bounties.length || availableBounties.length) && loading ? (
        <div className="h-[325px] flex items-center place-content-center mb-6">
          <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse">
            Calculating best route...
          </div>
        </div>
      ) : null}

      {bountiesToAbandon?.length ? (
        <>
          <Subheading>Abandon</Subheading>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {bountiesToAbandon.map((key) => (
              <Bounty key={key} bountyKey={key} />
            ))}
          </div>
        </>
      ) : null}

      {bountiesToPickup?.length ? (
        <>
          <Subheading>Pickup</Subheading>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {bountiesToPickup.map((key) => (
              <Bounty key={key} bountyKey={key} />
            ))}
          </div>
        </>
      ) : null}

      {/*{result ? (*/}
      {/*  <>*/}
      {/*    <Subheading>Route</Subheading>*/}
      {/*    <Paragraph>*/}
      {/*      After abandoning and/or picking up the bounties mentioned above,*/}
      {/*      take the following route to complete them in the most efficient way:*/}
      {/*    </Paragraph>*/}
      {/*    /!*<div className="grid grid-cols-6 gap-0">*!/*/}
      {/*    /!*  {data.deliveries.map((bounty) => (*!/*/}
      {/*    /!*    <Bounty key={bounty} type={bounty} size="small" />*!/*/}
      {/*    /!*  ))}*!/*/}
      {/*    /!*</div>*!/*/}
      {/*  </>*/}
      {/*) : null}*/}

      {result?.actions?.length ? (
        <div className="relative overflow-x-auto my-7">
          <table className="table-fixed w-full text-left rtl:text-right">
            <thead className="text-gray-900 uppercase">
              <tr className="border-b border-gray-100">
                <th scope="col" className="py-3">
                  Action
                </th>
                <th scope="col" className="py-3">
                  Item
                </th>
                <th scope="col" className="py-3 text-right">
                  Location
                </th>
                <th scope="col" className="py-3 text-right">
                  Est. Time
                </th>
              </tr>
            </thead>
            <tbody>
              {result.actions.map((action, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 last:border-none"
                >
                  <td className="py-3 capitalize">{action.type}</td>
                  <td className="py-3">
                    {action.item ? (
                      <Bounty bountyKey={action.item} size="small" />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-3 text-right">{action.location}</td>
                  <td className="py-3 text-right">
                    {formatTime(Math.round(action.distance))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {result?.actions?.length && (
        <Paragraph className="mt-10">
          To modify your selections, you can go back to the previous page.
        </Paragraph>
      )}
    </Page>
  );
};

export default RoutePlanner;
