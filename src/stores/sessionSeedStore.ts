import makeSimpleStore from "../hooks/makeSimpleStore";
import { clamp } from "../utils/math";
import { initTileValues } from "../utils/minesweeperGrid";
import { Adjacency } from "../utils/sessionConstants";

export type SessionSeed = {
  cols: number;
  rows: number;
  nrTiles: number;
  nrMines: number;
  tileValues: Adjacency[];
};

function getInitialState(cols: number, rows: number, nrMines: number) {
  const nrTiles = cols * rows;
  return {
    cols: cols,
    rows: rows,
    nrTiles: nrTiles,
    nrMines: clamp(nrMines, 0, nrTiles),
    tileValues: initTileValues(cols, rows, nrMines),
  };
}

const [SessionSeedProvider, useSessionSeed, useSetSessionSeed] =
  makeSimpleStore<SessionSeed>(getInitialState(9, 9, 5));
export { SessionSeedProvider, useSessionSeed, useSetSessionSeed };
