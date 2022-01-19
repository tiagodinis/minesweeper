import createSimpleStore from "../factories/createSimpleStore";
import { clamp } from "../utils/math";
import { initTileValues } from "../utils/minesweeperGrid";
import { Adjacency } from "../utils/gameConstants";

export type GameValues = {
  cols: number;
  rows: number;
  nrTiles: number;
  nrMines: number;
  tileValues: Adjacency[];
};

export function createGameValues(
  cols: number,
  rows: number,
  nrMines: number
): GameValues {
  const nrTiles = cols * rows;
  return {
    cols: cols,
    rows: rows,
    nrTiles: nrTiles,
    nrMines: clamp(nrMines, 0, nrTiles),
    tileValues: initTileValues(cols, rows, nrMines),
  };
}

const [GameValuesProvider, useGameValues, useSetGameValues] =
  createSimpleStore<GameValues>(createGameValues(9, 9, 10));
export { GameValuesProvider, useGameValues, useSetGameValues };
