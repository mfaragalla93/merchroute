import About from "./About.jsx";
import Configuration from "./Configuration.jsx";
import SelectBounties from "./SelectBounties.jsx";
import RoutePlanner from "./RoutePlanner.jsx";

export const categories = ["Settings", "Routes"];

const pages = [
  {
    title: "About",
    path: "/",
    component: About,
  },
  {
    title: "Configuration",
    path: "/configuration",
    component: Configuration,
    category: categories[0],
  },
  {
    title: "Select Bounties",
    path: "/select-bounties",
    component: SelectBounties,
    category: categories[1],
  },
  {
    title: "Route Selection",
    path: "/route-planner",
    component: RoutePlanner,
    category: categories[1],
  },
];

export default pages;
