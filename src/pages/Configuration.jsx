import Page from "../components/Page.jsx";
import Paragraph from "../components/Paragraph.jsx";
import Subheading from "../components/Subheading.jsx";
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
  // {
  //   level: 121,
  //   rooms: ["Geld Family Residence", "Geld Family Logistics"],
  // },
  // {
  //   level: 168,
  //   rooms: ["Dilapidated Warehouse", "Slant Street Cart House"],
  // },
  // {
  //   level: 219,
  //   rooms: ["Oscen's Warehouse", "Market Chambers"],
  // },
  // {
  //   level: 344,
  //   rooms: ["Four Winds Side Room", "Four Winds Back Room"],
  //   infoNeeded: true,
  // },
  // {
  //   level: 451,
  //   rooms: ["Gillad's House", "The Quill Club"],
  //   infoNeeded: true,
  // },
];

const Configuration = () => {
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
    <Page
      title="Configuration"
      meta="Settings for the tool are saved to your browser."
    >
      <Subheading>Merchanting Level</Subheading>
      <Paragraph>
        Used to hide bounties that require a higher merchanting level. Leave
        blank to show all bounties.
      </Paragraph>

      <input
        value={merchantingLevel}
        onChange={(e) => setMerchantingLevel(e.target.value)}
        type="number"
        min="0"
        max="500"
        className="mb-5 block p-2 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 sm:text-md focus:ring-blue-500 focus:border-blue-500"
      />

      <Subheading>Detective Level</Subheading>
      <Paragraph>
        Higher detective levels allow for shorter routes by unlocking rooms. If
        you leave this blank, the tool will assume you have a detective level of
        zero. It is <span className="font-bold">highly recommended</span> to set
        this, or the tool will not take into account any rooms you have
        unlocked.
      </Paragraph>

      <input
        value={detectiveLevel}
        onChange={(e) => setDetectiveLevel(e.target.value)}
        type="number"
        min="0"
        max="500"
        className="mb-5 block p-2 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 sm:text-md focus:ring-blue-500 focus:border-blue-500"
      />

      <Paragraph className="mb-5 dark:text-zinc-300">
        <div className="font-semibold mb-2">Additional room unlocks:</div>
        <ul className="list-disc ml-5">
          {detectiveLevel < 4 && <li className="mb-2">None.</li>}
          {additionalRooms.map(
            ({ level, rooms }) =>
              detectiveLevel >= level && (
                <li key={level} className="mb-2">
                  {rooms.join(" and ")}{" "}
                </li>
              ),
          )}
        </ul>
      </Paragraph>

      <Subheading>Quests</Subheading>
      <Paragraph>
        Some quests unlock new rooms. It is{" "}
        <span className="font-bold">highly recommended</span> to check any
        completed quests, or the tool will not take them into account.
      </Paragraph>

      <div className="flex items-center mb-4 select-none">
        <input
          id="battle-of-fortunehold"
          type="checkbox"
          checked={battleOfFortuneholdCompleted}
          onChange={(e) => setBattleOfFortuneholdCompleted(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
        />
        <label
          htmlFor="battle-of-fortunehold"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
        >
          Battle of Fortunehold
        </label>
      </div>

      <Subheading>Round Trips</Subheading>
      <Paragraph>
        If enabled, the tool will find the best route to complete all bounties
        and return to the bounty board. This may be slightly different from the
        fastest route to complete all bounties, but it is more efficient if you
        plan on making multiple trips.
      </Paragraph>

      <div className="flex items-center mb-4 select-none">
        <input
          id="roundtrips"
          type="checkbox"
          checked={roundTrip}
          onChange={(e) => setRoundTrip(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
        />
        <label
          htmlFor="roundtrips"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
        >
          Round Trips
        </label>
      </div>

      <Paragraph className="mt-10">
        Your settings are saved automatically when changed.
      </Paragraph>
    </Page>
  );
};

export default Configuration;
