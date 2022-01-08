import { Adjacency, TileState } from "./sessionConstants";
import { clamp } from "./math";

export function initTileValues(cols: number, rows: number, nrMines: number) {
  let newTileValues: Adjacency[] = Array(cols * rows).fill(0);
  nrMines = clamp(nrMines, 0, newTileValues.length);

  // Create an array of shuffled indices: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  let mineIndices: number[] = [];
  for (let i = 0; i < newTileValues.length; ++i) mineIndices.push(i);
  for (let i = mineIndices.length - 1; i > 0; --i) {
    let j = Math.trunc(Math.random() * (i + 1));
    [mineIndices[i], mineIndices[j]] = [mineIndices[j], mineIndices[i]];
  }

  // Place mines and register the adjacency on non-mine neighbours
  for (let i = 0; i < nrMines; ++i) {
    newTileValues[mineIndices[i]] = -1;
    getValidNeighbours(mineIndices[i], cols, rows).forEach((nInd) => {
      if (newTileValues[nInd] !== -1) newTileValues[nInd]++;
    });
  }

  return newTileValues;
}

export function onGameOverReveal(
  index: number,
  tileStates: TileState[],
  tileValues: Adjacency[]
) {
  // Reveal every mine, mark wrong flags and losing mine position
  let newTileStates = [...tileStates];
  tileValues.forEach((tv, index) => {
    if (tv === -1 && tileStates[index] !== TileState.Flagged)
      newTileStates[index] = TileState.Revealed;
    if (tv !== -1 && tileStates[index] === TileState.Flagged)
      newTileStates[index] = TileState.WrongFlag;
  });
  newTileStates[index] = TileState.LosingMine;

  return newTileStates;
}

export function flagMines(tileStates: TileState[], tileValues: Adjacency[]) {
  let newTileStates = [...tileStates];
  tileValues.forEach((tv, index) => {
    if (tv === -1 && tileStates[index] !== TileState.Flagged)
      newTileStates[index] = TileState.Flagged;
  });

  return newTileStates;
}

export function revealNeighbours(
  index: number,
  cols: number,
  rows: number,
  tileStates: TileState[],
  tileValues: Adjacency[]
) {
  let newTileStates = [...tileStates];
  newTileStates[index] = TileState.Revealed;
  let revealedTiles = 1;
  let queue = [index];

  // Reveal neighbours of an empty tile, add empty neighbours found to queue
  while (queue.length) {
    getValidNeighbours(queue.shift()!, cols, rows).forEach((nInd) => {
      if (newTileStates[nInd] !== TileState.Idle) return;
      newTileStates[nInd] = TileState.Revealed;
      revealedTiles++;
      if (tileValues[nInd] === 0) queue.push(nInd);
    });
  }

  return { newTileStates, revealedTiles };
}

export function getValidNeighbours(index: number, cols: number, rows: number) {
  let col = index % cols;
  let row = Math.trunc(index / cols);
  let nInds: number[] = [];
  if (!insideGrid(col, row, cols, rows)) return nInds;
  if (insideGrid(col - 1, row - 1, cols, rows)) nInds.push(index - cols - 1);
  if (insideGrid(col, row - 1, cols, rows)) nInds.push(index - cols);
  if (insideGrid(col + 1, row - 1, cols, rows)) nInds.push(index - cols + 1);
  if (insideGrid(col - 1, row, cols, rows)) nInds.push(index - 1);
  if (insideGrid(col + 1, row, cols, rows)) nInds.push(index + 1);
  if (insideGrid(col - 1, row + 1, cols, rows)) nInds.push(index + cols - 1);
  if (insideGrid(col, row + 1, cols, rows)) nInds.push(index + cols);
  if (insideGrid(col + 1, row + 1, cols, rows)) nInds.push(index + cols + 1);
  return nInds;
}

export function insideGrid(c: number, r: number, cols: number, rows: number) {
  return c >= 0 && c < Math.max(0, cols) && r >= 0 && r < Math.max(0, rows);
}

// c: -1 r: -1
// c: -1 r: 0
// c: 0 r: -1
// c: 0 r: 0
// c: cols - 1 r: rows -1
// c: cols r: rows -1
// c: cols - 1 r: rows
// c: cols r: rows
// c: cols / 2 r: rows / 2
