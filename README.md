# Pathfinder for Brigher Shores

A tool for Brighter Shores which finds the best merchanting routes.

## How it works
Select bounties which you currently have, and the tool will use Dijkstra's algorithm to find the best possible paths 
for you to take to complete each bounty.

Rooms unlocked by quests and den raids are taken into account, so make sure to configure your settings accordingly.

You can optionally wait and select more bounties when they become available from the bounty board. The tool will 
calculate the best route from all possible bounties and let you know which ones to abandon and which ones to pick up.

## Time estimations
The best routes are calculated by time and not by distance. ETAs are provided for each step of the route and are a 
great way to gauge the accuracy of the tool. If you find these estimations are off, then please let us know on our
[DiscordIcon](https://discord.gg/fcSYv9GPwJ) server so that we can improve our algorithm.

## Contributing
You do not need to be a developer to contribute to the tool. Join our [DiscordIcon](https://discord.gg/fcSYv9GPwJ) server to help in various ways:

- The `#data-needed` channel includes specific things we need help with, such as item images or information about den raid rooms.
- Post any routes which are faster than what the tool suggests in `#better-routes`
- Post `#bug-reports`
- Post `#inaccurate-etas`
- Post any other `#ideas-and-suggestions` you have!

If you are a developer who wants to help contribute, please read on!

## Project structure

This is a ReactJS project bootstrapped with Vite. There is no back-end server, all calculations are performed client-side.

### `src/`

- `algorithm/`: Contains everything related to the pathfinding algorithm. Contains no front-end code, 
so you needn't worry about ReactJS here. Anybody who is familiar with JavaScript can contribute to this
part of the project. I tried to document this code via comments as best as I could, so you can hop in and take a look
at how things work. I would recommend starting with `gps.js`, and then `pathfinder.js`. I will work on a more detailed
documentation for this part of the project in the future.

The remaining directories are standard ReactJS directories. If you are familiar with ReactJS, you can contribute to these
parts of the project. If you are not familiar with ReactJS, you can still contribute to the project by working on the
algorithm part of the project.

- `components/`: Contains all the React components used in the project.
- `pages/`: Contains all the pages of the project.
- `hooks/`: Contains all the custom hooks used in the project.
- `icons/`: Contains all the SVG icons used in the project.

## Map Nodes
All the nodes in the graph are stored at `src/algorithm/nodes.json` and are assigned numbers.
These numbers are referenced on the following map which I have created (15mb image): https://i.imgur.com/lI0cRas.jpeg

These numbers are chosen arbitrarily, I have just incremented them as I went along. I use GIMP to modify this image
when I need to add new nodes, the layers help me keep track of the nodes. If you are interested in the GIMP file, 
let me know on [DiscordIcon](https://discord.gg/fcSYv9GPwJ) and I can provide it.

## Running the project

Ensure you have NodeJS installed on your machine. You can download it from [here](https://nodejs.org/en/).

1. Clone the repository
    ```
    git clone https://github.com/bricefrisco/brighter-shores-routefinder.git
    ```

2. Install the dependencies
    ```
    cd brighter-shores-routefinder
    npm install
    ```

3. Run the project
    ```
    npm run dev
    ```

This will start the development server, and you can view the project at `http://localhost:5173/`.