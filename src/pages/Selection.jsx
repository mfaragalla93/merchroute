import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/catalyst/table.jsx";
import { Heading } from "../components/catalyst/heading.jsx";
import { Strong, Text, TextLink } from "../components/catalyst/text.jsx";
import { Button } from "../components/catalyst/button.jsx";
import { Input, InputGroup } from "../components/catalyst/input.jsx";
import {
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/16/solid/index.js";
import useBounties from "../hooks/useBounties.js";
import { Badge } from "../components/catalyst/badge.jsx";
import { Avatar } from "../components/catalyst/avatar.jsx";
import { useMemo, useState } from "react";
import Page from "../components/Page.jsx";
import {
  Checkbox,
  CheckboxField,
  CheckboxGroup,
} from "../components/catalyst/checkbox.jsx";
import OCR from "../components/OCR.jsx";

const Selection = () => {
  const [filter, setFilter] = useState("");
  const [ocr, setOcr] = useState(false);

  const {
    bounties,
    count,
    increment,
    decrement,
    toggleBountyBoard,
    bountyBoardCount,
    resetBounties,
    resetBountyBoard,
  } = useBounties("bountiesV3");

  const filteredBounties = useMemo(() => {
    if (!filter) {
      return bounties;
    }

    return bounties.filter((bounty) => {
      return bounty.name.toLowerCase().includes(filter.toLowerCase());
    });
  }, [filter, bounties]);

  return (
    <Page bounded>
      <Heading>Bounty selection</Heading>
      <Text className="mt-1">
        Select up to 12 bounties. If you select more than 6, we&apos;ll let you
        know the best 6 to complete.
      </Text>
      <Text>
        Not all bounties have been unlocked yet. If we&apos;re missing a bounty
        you have, join our{" "}
        <TextLink href="https://discord.gg/fcSYv9GPwJ">Discord</TextLink> to
        help us out!
      </Text>

      <div className="flex items-center justify-between mt-10 mb-2">
        <div className="flex gap-x-4">
          <InputGroup>
            <MagnifyingGlassIcon />
            <Input
              name="filter"
              placeholder="Filter&hellip;"
              aria-label="Filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </InputGroup>
          <Button color="light" onClick={() => setOcr(true)}>
            <Badge color="green">New</Badge>
            Detect with OCR
          </Button>
          <OCR open={ocr} setOpen={setOcr} />
        </div>

        <Button color="blue" href="/route">
          Continue
        </Button>
      </div>

      <div className="mt-2 overflow-y-auto scrollbar-thin">
        <Table dense grid>
          <TableHead>
            <TableRow>
              <TableHeader>Type</TableHeader>
              <TableHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-1">
                    <Text>Your Bounties</Text>
                    <Text className="w-10">[{count}/6]</Text>
                  </div>
                  <Button color="light" onClick={resetBounties}>
                    Reset
                  </Button>
                </div>
              </TableHeader>
              <TableHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-1">
                    <Text>(Optional) Bounty Board</Text>
                    <Text className="w-10">[{bountyBoardCount}/6]</Text>
                  </div>
                  <Button
                    color="light"
                    className="mr-3"
                    onClick={resetBountyBoard}
                  >
                    Reset
                  </Button>
                </div>
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBounties.map((bounty) => (
              <TableRow key={bounty.key}>
                <TableCell>
                  <div className="flex items-center gap-x-3">
                    <Avatar
                      src={`https://brightershoreswiki.org/images/${bounty.name.replace(/ /g, "_")}.png`}
                      className="size-10"
                      square
                    />
                    <Text>
                      <Strong>{bounty.name}</Strong>
                    </Text>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-x-3">
                      <Button
                        disabled={bounty.count === 0}
                        onClick={() => decrement(bounty.key)}
                        plain
                      >
                        <MinusIcon />
                      </Button>
                      <Button onClick={() => increment(bounty.key)} plain>
                        <PlusIcon />
                      </Button>
                    </div>
                    <Badge
                      color={bounty.count > 0 ? "green" : "zinc"}
                      className="w-10 flex justify-center"
                    >
                      {bounty.count}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="select-none">
                  <CheckboxGroup>
                    <CheckboxField>
                      <Checkbox
                        checked={Boolean(bounty.bountyBoard)}
                        onChange={(checked) =>
                          toggleBountyBoard(bounty.key, checked)
                        }
                      />
                    </CheckboxField>
                  </CheckboxGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Page>
  );
};

export default Selection;
