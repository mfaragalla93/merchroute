import useRoutes from "../hooks/useRoutes.js";
import Page from "../components/Page.jsx";
import { Text, TextLink } from "../components/catalyst/text.jsx";
import { Heading, Subheading } from "../components/catalyst/heading.jsx";
import { CheckCircleIcon } from "@heroicons/react/24/outline/index.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/catalyst/table.jsx";
import { Avatar } from "../components/catalyst/avatar.jsx";
import { bounties as bountyData } from "../algorithm/bounties.js";
import { useState } from "react";
import useBounties from "../hooks/useBounties.js";
import { Button } from "../components/catalyst/button.jsx";

const formatTime = (input) => {
  let seconds = parseInt(input, 10);
  if (isNaN(seconds)) {
    return input;
  }

  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes} minutes, ${seconds} seconds`;
  } else {
    return `${seconds} seconds`;
  }
};

const Plan = () => {
  const [selection, setSelection] = useState(0);
  const { count, bountyBoardCount } = useBounties("bountiesV3");
  const { loading, results } = useRoutes();

  if (count + bountyBoardCount === 0) {
    return (
      <Page>
        <Heading>Routes</Heading>
        <Text>
          You haven&apos;t <TextLink href="/select">selected</TextLink> any
          bounties yet.
        </Text>
        <div className="mt-5">
          <Button color="blue" href="/select">
            Select bounties
          </Button>
        </div>
      </Page>
    );
  }

  if (loading) {
    return (
      <Page>
        <Heading>Routes</Heading>
        <Text className="animate-pulse">
          Calculating the best routes... This could take a few seconds.
        </Text>
      </Page>
    );
  }

  return (
    <Page>
      <Heading>Routes</Heading>
      <div className="mt-5">
        {results.length > 1 ? (
          <>
            <Subheading>Select bounties</Subheading>
            <div className="flex items-center justify-between">
              <Text>
                We&apos;ve found a few possible bounty combinations for you.
              </Text>
              <Button color="blue" href="/select">
                Change selections
              </Button>
            </div>
          </>
        ) : (
          <>
            <Subheading>Bounties</Subheading>
            <div className="flex items-center justify-between">
              <Text>Here&apos;s the bounties you selected.</Text>
              <Button color="blue" href="/select">
                Change selections
              </Button>
            </div>
          </>
        )}

        <Table dense grid className="mt-3">
          <TableHead>
            <TableRow>
              {results.length > 1 && <TableHeader>Selected</TableHeader>}
              <TableHeader>Bounties</TableHeader>
              {results.length > 1 && <TableHeader>Experience</TableHeader>}
              <TableHeader>Time</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => {
              return (
                <TableRow
                  key={index}
                  onClick={() => setSelection(index)}
                  href={results.length > 1 && "#"}
                >
                  {results.length > 1 && (
                    <TableCell className="text-center">
                      {selection === index && (
                        <CheckCircleIcon className="size-7 text-green-500" />
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-x-2">
                      {result.bounties.map((bounty, index) => (
                        <Avatar
                          key={index}
                          src={`https://brightershoreswiki.org/images/${bountyData[bounty].name.replace(/ /g, "_")}.png`}
                          className="size-8"
                          square
                        />
                      ))}
                    </div>
                  </TableCell>
                  {results.length > 1 && (
                    <TableCell>
                      <Text>{result.experience.toLocaleString()}</Text>
                    </TableCell>
                  )}
                  <TableCell>
                    <Text>{formatTime(result.distance)}</Text>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-5">
        <Subheading>Route</Subheading>
        <Text>Here&apos;s the route you should take.</Text>
        <Table dense grid className="mt-3">
          <TableHead>
            <TableRow>
              <TableHeader>Action</TableHeader>
              <TableHeader>Item</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Time</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {results[selection]?.actions.map((action, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Text className="capitalize">{action.type}</Text>
                </TableCell>
                <TableCell>
                  {action.item && (
                    <div className="flex items-center gap-x-2">
                      <Avatar
                        src={`https://brightershoreswiki.org/images/${bountyData[action.item].name.replace(/ /g, "_")}.png`}
                        className="size-8"
                        square
                      />
                      <Text>{bountyData[action.item].name}</Text>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Text>{action.location}</Text>
                </TableCell>
                <TableCell>
                  <Text>{formatTime(action.distance)}</Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Page>
  );
};

export default Plan;
