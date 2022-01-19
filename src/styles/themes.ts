import { Adjacency } from "../utils/gameConstants";

export enum Theme {
  Light,
  Dark,
}

declare module "styled-components" {
  export interface DefaultTheme {
    id: Theme;
    BG: string;
    fontColor: string;
    boardBG: string;
    boardBGShadow: string;
    boardBGAccent: string;
    revealedTile: string;
    unrevealedTile: string;
    mistakeTile: string;
    adjacency: (adjacencyValue: Adjacency) => string;
  }
}

export const lightTheme = {
  id: Theme.Light,
  BG: "#f0f0f0",
  fontColor: "#1a1a1a",
  boardBG: "#C03F77",
  boardBGShadow: "hsl(340 51% 45% / 0.5)",
  boardBGAccent: "#a93769",
  revealedTile: "#bbbbbb",
  unrevealedTile: "#e9e9e9",
  mistakeTile: "red",
  adjacency: (adjacencyValue: Adjacency) => {
    if (adjacencyValue === 1) return "#3d7052";
    else if (adjacencyValue === 2) return "#397b6c";
    else if (adjacencyValue === 3) return "#39637b";
    else if (adjacencyValue === 4) return "#214365";
    else if (adjacencyValue === 5) return "#212265";
    else if (adjacencyValue === 6) return "#392165";
    else if (adjacencyValue === 7) return "#5b2165";
    else if (adjacencyValue === 8) return "#6e193b";
    else return "transparent"; // (!) irrelevant case for -1 && 0 adjacency
  },
};

export const darkTheme = {
  id: Theme.Dark,
  BG: "#1a1a1a",
  fontColor: "#f0f0f0",
  boardBG: "#397b6c",
  boardBGShadow: "hsl(0 0% 0% / 0.5)",
  boardBGAccent: "#326c5f",
  revealedTile: "#3f3f3f",
  unrevealedTile: "#232323",
  mistakeTile: "red",
  adjacency: (adjacencyValue: Adjacency) => {
    if (adjacencyValue === 1) return "#60c689";
    else if (adjacencyValue === 2) return "#57dcbe";
    else if (adjacencyValue === 3) return "#57acdc";
    else if (adjacencyValue === 4) return "#276bb0";
    else if (adjacencyValue === 5) return "#272ab0";
    else if (adjacencyValue === 6) return "#5727b0";
    else if (adjacencyValue === 7) return "#9c27b0";
    else if (adjacencyValue === 8) return "#c2185b";
    else return "white"; // (!) irrelevant case for -1 && 0 adjacency
  },
};
