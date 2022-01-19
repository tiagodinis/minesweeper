import { useMemo } from "react";
import createDependentStore from "../factories/createDependentStore";
import {
  flagMines,
  onGameOverReveal,
  revealNeighbours,
} from "../utils/minesweeperGrid";
import { InteractionState, TileState } from "../utils/gameConstants";
import { createGameValues, GameValues, useGameValues } from "./gameValuesStore";

type GameSessionDeps = {
  gameValues: GameValues;
};

type Game = {
  interactionState: InteractionState;
  tileStates: TileState[];
  revealedOnce: boolean;
  nrFlags: number;
  nrUnrevealed: number;
  isLeftMouseDown: boolean;
  hoveredState: TileState | null;
};

type GameAction = {
  type: GameActionType;
  payload?: { index: number };
};

export enum GameActionType {
  DepsChanged,
  Hover,
  Unhover,
  LeftClick,
  RightClick,
  LeftDown,
  LeftUp,
}

function useDeps(): GameSessionDeps {
  const gameValues = useGameValues();
  const deps = useMemo(
    () => ({
      gameValues: gameValues,
    }),
    [gameValues]
  );

  return deps;
}

function reducer(deps: GameSessionDeps, state: Game, action: GameAction) {
  // Restart
  if (action.type === GameActionType.DepsChanged) return initState(deps);
  // LeftMouseDown
  if (action.type === GameActionType.LeftDown) {
    return {
      ...state,
      isLeftMouseDown: true,
      interactionState:
        state.hoveredState === TileState.Hovered
          ? InteractionState.Anticipation
          : state.interactionState,
    };
  }
  if (action.type === GameActionType.LeftUp) {
    return { ...state, isLeftMouseDown: false };
  }

  if (action.payload === undefined) throw new Error("Action has no payload");

  const tIndex = action.payload.index;
  const tState = state.tileStates[tIndex];

  // Don't handle interactions if the game "is not running"
  if (state.interactionState === InteractionState.Victory) return state;
  if (state.interactionState === InteractionState.GameOver) return state;

  // Hovering
  if (tState === TileState.Idle && action.type === GameActionType.Hover)
    return {
      ...state,
      tileStates: changeSingleTile(state.tileStates, tIndex, TileState.Hovered),
      interactionState: state.isLeftMouseDown
        ? InteractionState.Anticipation
        : state.interactionState,
      hoveredState: TileState.Hovered,
    };
  if (tState === TileState.Hovered && action.type === GameActionType.Unhover)
    return {
      ...state,
      tileStates: changeSingleTile(state.tileStates, tIndex, TileState.Idle),
      interactionState: state.isLeftMouseDown
        ? InteractionState.Idle
        : state.interactionState,
      hoveredState: null,
    };

  // Clicking
  if (tState === TileState.Hovered && action.type === GameActionType.LeftClick)
    return revealTile(deps.gameValues, state, tIndex);
  if (action.type === GameActionType.RightClick)
    return toggleTileFlag(deps.gameValues.nrMines, state, tIndex, tState);

  return state;
}

function revealTile(gameValues: GameValues, state: Game, index: number) {
  const { cols, rows, tileValues } = gameValues;
  const { tileStates, nrUnrevealed } = state;
  // Mine
  if (tileValues[index] === -1) {
    return {
      ...state,
      revealedOnce: true,
      interactionState: InteractionState.GameOver,
      tileStates: onGameOverReveal(index, tileStates, tileValues),
      hoveredState: TileState.LosingMine,
    };
  }
  // Empty
  else if (tileValues[index] === 0) {
    const { newTileStates, revealedTiles } = revealNeighbours(
      index,
      cols,
      rows,
      tileStates,
      tileValues
    );
    return {
      ...state,
      ...updateUnrevealed(
        gameValues,
        newTileStates,
        nrUnrevealed - revealedTiles
      ),
      hoveredState: TileState.Revealed,
    };
  }
  // Adjacent
  const newTileStates = changeSingleTile(
    state.tileStates,
    index,
    TileState.Revealed
  );
  return {
    ...state,
    ...updateUnrevealed(gameValues, newTileStates, nrUnrevealed - 1),
    hoveredState: TileState.Revealed,
  };
}

function updateUnrevealed(
  gameValues: GameValues,
  tileStates: TileState[],
  newNrUnrevealed: number
) {
  let newTileStates: TileState[] = tileStates;
  let newInteractionState = InteractionState.Idle;
  if (newNrUnrevealed === gameValues.nrMines) {
    newTileStates = flagMines(tileStates, gameValues.tileValues);
    newInteractionState = InteractionState.Victory;
  }

  return {
    revealedOnce: true,
    nrUnrevealed: newNrUnrevealed,
    interactionState: newInteractionState,
    tileStates: newTileStates,
  };
}

function toggleTileFlag(
  nrMines: number,
  state: Game,
  index: number,
  tState: TileState
) {
  if (tState === TileState.Hovered)
    return {
      ...state,
      interactionState:
        state.nrFlags + 1 > nrMines
          ? InteractionState.Confused
          : InteractionState.JustFlagged,
      tileStates: changeSingleTile(state.tileStates, index, TileState.Flagged),
      nrFlags: state.nrFlags + 1,
      hoveredState: TileState.Hovered,
    };

  // Flagged
  return {
    ...state,
    interactionState: InteractionState.Confused,
    tileStates: changeSingleTile(state.tileStates, index, TileState.Hovered),
    nrFlags: state.nrFlags - 1,
    hoveredState: TileState.Flagged,
  };
}

function changeSingleTile(
  tileStates: TileState[],
  index: number,
  newTileState: TileState
) {
  return [
    ...tileStates.slice(0, index),
    newTileState,
    ...tileStates.slice(index + 1),
  ];
}

function initState(deps: GameSessionDeps): Game {
  return {
    interactionState: InteractionState.Idle,
    tileStates: Array(deps.gameValues.nrTiles).fill(TileState.Idle),
    revealedOnce: false,
    isLeftMouseDown: false,
    nrFlags: 0,
    nrUnrevealed: deps.gameValues.nrTiles,
    hoveredState: null,
  };
}

const [GameSessionProvider, useGameSession, useDispatchGameSession] =
  createDependentStore<GameSessionDeps, Game, GameAction>(
    useDeps,
    reducer,
    initState({ gameValues: createGameValues(9, 9, 5) }),
    { type: GameActionType.DepsChanged },
    false
  );
export { GameSessionProvider, useGameSession, useDispatchGameSession };
