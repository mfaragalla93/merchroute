import Page from "../components/Page.jsx";
import { Heading, Subheading } from "../components/catalyst/heading.jsx";
import { Divider } from "../components/catalyst/divider.jsx";
import { Text } from "../components/catalyst/text.jsx";
import { Input } from "../components/catalyst/input.jsx";
import { Switch } from "../components/catalyst/switch.jsx";
import useSettings from "../hooks/useSettings.js";

const additionalRooms = [
  {
    level: 4,
    rooms: ["Geld Family Residence", "Geld Family Logistics"],
  },
  {
    level: 8,
    rooms: ["Dilapidated Warehouse", "Slant Street Cart House"],
  },
  {
    level: 18,
    rooms: ["Oscen's Warehouse", "Market Chambers"],
  },
  {
    level: 51,
    rooms: ["Four Winds Back Room", "Four Winds Side Room"],
  },
  {
    level: 83,
    rooms: ["Gillad's House", "The Quill Club"],
  },
];

const Settings = () => {
  const {
    merchantingLevel,
    detectiveLevel,
    battleOfFortuneholdCompleted,
    roundTrip,
    setMerchantingLevel,
    setDetectiveLevel,
    setBattleOfFortuneholdCompleted,
    setRoundTrip,
  } = useSettings();

  return (
    <Page>
      <div className="pb-10">
        <Heading>Settings</Heading>
        <Text className="mt-2">
          Your settings are saved automatically when changed.
        </Text>
      </div>
      <Divider />

      <div className="py-10">
        <div className="grid grid-cols-4">
          <div className="col-span-3">
            <Subheading>Detective Level</Subheading>
            <Text className="max-w-2xl">
              Higher detective levels allow for shorter routes by unlocking
              rooms. If you leave this blank, the tool will assume you have a
              detective level of zero.
            </Text>
          </div>
          <div className="flex items-center">
            <Input
              value={detectiveLevel}
              type="number"
              onChange={(e) => setDetectiveLevel(e.target.value)}
            />
          </div>
        </div>
        <Text className="mt-4">
          Additional room unlocks:
          <ul className="list-disc ml-5 mt-2">
            {detectiveLevel < 4 && <li className="mb-2">None</li>}
            {additionalRooms.map(
              ({ level, rooms }) =>
                detectiveLevel >= level && (
                  <li key={level} className="mb-2">
                    {rooms.join(" and ")}{" "}
                  </li>
                ),
            )}
          </ul>
        </Text>
      </div>

      <Divider soft />

      <div className="py-10 grid grid-cols-4">
        <div className="col-span-3">
          <Subheading>Battle of Fortunehold</Subheading>
          <Text className="max-w-2xl">
            Completing this quest unlocks a shortcut between Fortunehold Farm
            and Meggrit&apos;s Market.
          </Text>
        </div>
        <div className="flex items-center">
          <Switch
            checked={battleOfFortuneholdCompleted}
            onChange={setBattleOfFortuneholdCompleted}
          />
        </div>
      </div>

      <Divider soft />
      <div className="py-10 grid grid-cols-4">
        <div className="col-span-3">
          <Subheading>Round trips</Subheading>
          <Text className="max-w-2xl">
            If enabled, we&apos;ll find the best route to complete all bounties
            and return to the bounty board. This may be slightly different from
            the fastest route to complete all bounties, but it is more efficient
            if you plan on making multiple trips.
          </Text>
        </div>
        <div className="flex items-center">
          <Switch checked={roundTrip} onChange={setRoundTrip} />
        </div>
      </div>
    </Page>
  );
};

export default Settings;
