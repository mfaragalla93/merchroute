import Page from "../components/Page.jsx";
import { Heading, Subheading } from "../components/catalyst/heading.jsx";
import { Text, TextLink } from "../components/catalyst/text.jsx";
import { Divider } from "../components/catalyst/divider.jsx";
import { Button } from "../components/catalyst/button.jsx";

const Home = () => {
  return (
    <Page>
      <div className="pb-10">
        <Heading>RouteFinder</Heading>
        <Text className="mt-2">
          A tool for Brighter Shores which finds the best merchanting routes.
        </Text>
      </div>

      <Divider />

      <div className="py-10 max-w-2xl">
        <Subheading>How it works</Subheading>
        <Text className="mt-3">
          Select bounties which you currently have, and we&apos;ll use{" "}
          <TextLink
            href="https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dijkstra&apos;s algorithm
          </TextLink>{" "}
          to find the best possible paths for you to take to complete each
          bounty.
        </Text>
        <Text className="mt-3">
          Rooms unlocked by quests and den raids are taken into account, so make
          sure to <TextLink href="/settings">configure</TextLink> your settings
          accordingly.
        </Text>
        <Text className="mt-3">
          You can optionally wait and select more bounties when they become
          available from the bounty board. We&apos;ll calculate the best route
          from all possible bounties and let you know which ones to abandon and
          which ones to pick up.
        </Text>
      </div>

      <Divider soft />

      <div className="py-10 max-w-2xl">
        <Subheading>Time estimations</Subheading>
        <Text className="mt-2">
          The best routes are calculated by time and not by distance. ETAs are
          provided for each step of the route and are a great way to gauge the
          accuracy of the tool. If you find these estimations are off, then
          please let us know on our{" "}
          <TextLink
            href="https://discord.gg/fcSYv9GPwJ"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord server
          </TextLink>{" "}
          so that we can improve our algorithm.
        </Text>
      </div>

      <Divider soft />

      <div className="py-10 max-w-2xl">
        <Subheading>Contributing</Subheading>
        <Text className="mt-2">
          You do not need to be a developer to contribute to the tool. Join our{" "}
          <TextLink
            href="https://discord.gg/fcSYv9GPwJ"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord server
          </TextLink>{" "}
          to help in various ways:
          <ul className="list-disc ml-5 mt-2">
            <li className="mb-1">
              The &quot;help-needed&quot; channel includes specific things we
              need help with, such as item images or information about den raid
              rooms.
            </li>
            <li className="mb-1">Post any ideas and suggestions you have</li>
            <li className="mb-1">
              Let us know of any routes which are faster than what the tool
              suggests
            </li>
            <li className="mb-1">Report inaccurate ETAs</li>
            <li className="mb-1">Report bugs</li>
          </ul>
        </Text>

        <Text className="mt-2">
          This tool is open source and the code is available on{" "}
          <TextLink
            href="https://github.com/bricefrisco/brighter-shores-routefinder"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </TextLink>
          . Further technical details regarding how the tool works can be found
          there. All code contributions are welcome!
        </Text>
      </div>

      <Divider soft />

      <div className="pt-10">
        <Text className="mb-3">
          After <TextLink href="/settings">configuring</TextLink> your settings,
          go <TextLink href="/select">select</TextLink> your bounties!
        </Text>
      </div>
    </Page>
  );
};

export default Home;
