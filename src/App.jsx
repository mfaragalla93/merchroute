import { Route, Routes, useLocation } from "react-router-dom";
import { useDarkModeContext } from "./context/DarkModeProvider.jsx";
import { Avatar } from "./components/catalyst/avatar.jsx";
import {
  ArrowsPointingInIcon,
  Cog6ToothIcon,
  HomeIcon,
  MoonIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/16/solid/index.js";
import GithubIcon from "./icons/GithubIcon.jsx";
import DiscordIcon from "./icons/DiscordIcon.jsx";
import Selection from "./pages/Selection.jsx";
import { SidebarLayout } from "./components/catalyst/sidebar-layout.jsx";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "./components/catalyst/sidebar.jsx";
import Plan from "./pages/Plan.jsx";
import Settings from "./pages/Settings.jsx";
import Home from "./pages/Home.jsx";

const navItems = [
  {
    items: [
      { label: "Home", url: "/", icon: <HomeIcon /> },
      { label: "Settings", url: "/settings", icon: <Cog6ToothIcon /> },
    ],
  },
  {
    heading: "Bounties",
    items: [
      {
        label: "Select",
        url: "/select",
        icon: <ArrowsPointingInIcon />,
      },
      {
        label: "Route",
        url: "/route",
        icon: <PaperAirplaneIcon />,
      },
    ],
  },
  {
    heading: "Links",
    items: [
      {
        label: "Github",
        url: "https://github.com/bricefrisco/brighter-shores-routefinder",
        icon: <GithubIcon />,
        external: true,
      },
      {
        label: "Discord",
        url: "https://discord.gg/fcSYv9GPwJ",
        icon: <DiscordIcon />,
        external: true,
      },
    ],
  },
];

const App = () => {
  const { pathname } = useLocation();
  const { toggle } = useDarkModeContext();

  return (
    <SidebarLayout
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarItem>
              <Avatar src="favicon-32x32.png" />
              <SidebarLabel>RouteFinder</SidebarLabel>
            </SidebarItem>
          </SidebarHeader>
          <SidebarBody>
            {navItems.map(({ heading, items }) => (
              <SidebarSection key={heading || "Default"}>
                <SidebarHeading>{heading}</SidebarHeading>
                {items.map(({ label, url, icon, external }) => (
                  <SidebarItem
                    key={label}
                    href={url}
                    target={external && "_blank"}
                    rel={external && "noopener noreferrer"}
                    current={url === pathname}
                  >
                    {icon}
                    <SidebarLabel>{label}</SidebarLabel>
                  </SidebarItem>
                ))}
              </SidebarSection>
            ))}
          </SidebarBody>
          <SidebarFooter>
            <SidebarItem onClick={toggle}>
              <MoonIcon />
              <SidebarLabel>Dark mode</SidebarLabel>
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/select" element={<Selection />} />
        <Route path="/route" element={<Plan />} />
      </Routes>
    </SidebarLayout>
  );
};

export default App;
