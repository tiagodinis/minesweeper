import { createContext, Dispatch, useContext, useReducer } from "react";
import { SessionSeed, useSessionSeed } from "../stores/sessionSeedStore";
import {
  flagMines,
  onGameOverReveal,
  revealNeighbours,
} from "../utils/minesweeperGrid";
import { SessionState, TileState } from "../utils/sessionConstants";

type Session = {
  interactionState: SessionState;
  tileStates: TileState[];
  revealedOnce: boolean;
  isLeftMouseDown: boolean;
  nrFlags: number;
  nrUnrevealed: number;
};

type SessionAction = {
  type: SessionActionType;
  payload: { index: number };
};

export enum SessionActionType {
  Hover,
  Unhover,
  LeftClick,
  RightClick,
  LeftDown,
  LeftUp,
}

type SessionStore = [
  (props: { children: React.ReactNode }) => JSX.Element,
  () => Session,
  () => Dispatch<SessionAction>
];

export default function makeSessionStore(): SessionStore {
  // CONTEXTS
  const SessionContext = createContext<Session | undefined>(undefined);
  const SessionDispatchContext = createContext<
    Dispatch<SessionAction> | undefined
  >(undefined);

  // REDUCER
  function sessionReducer(
    seed: SessionSeed,
    state: Session,
    action: SessionAction
  ): Session {
    const tIndex = action.payload.index;
    const tState = state.tileStates[tIndex];

    // Don't handle interactions if the game "is not running"
    if (state.interactionState === SessionState.Victory) return state;
    if (state.interactionState === SessionState.GameOver) return state;

    console.log(action.type);

    // LeftMouseDown
    if (action.type === SessionActionType.LeftDown) {
      // TODO: Check if anticipation if hovering idle
      return { ...state, isLeftMouseDown: true };
    }
    if (action.type === SessionActionType.LeftUp) {
      return { ...state, isLeftMouseDown: false };
    }
    // Hovering
    if (tState === TileState.Idle && action.type === SessionActionType.Hover)
      return {
        ...state,
        tileStates: changeSingleTile(
          state.tileStates,
          tIndex,
          TileState.Hovered
        ),
        interactionState: state.isLeftMouseDown
          ? SessionState.Anticipation
          : state.interactionState,
      };
    if (
      tState === TileState.Hovered &&
      action.type === SessionActionType.Unhover
    )
      return {
        ...state,
        tileStates: changeSingleTile(state.tileStates, tIndex, TileState.Idle),
        interactionState: SessionState.Idle,
      };
    // Clicking
    if (
      tState === TileState.Hovered &&
      action.type === SessionActionType.LeftClick
    )
      return revealTile(seed, state, tIndex);
    if (action.type === SessionActionType.RightClick)
      return toggleTileFlag(seed.nrMines, state, tIndex, tState);

    return state;
  }

  function revealTile(seed: SessionSeed, state: Session, index: number) {
    const { cols, rows, tileValues } = seed;
    const { tileStates, nrUnrevealed } = state;
    // Mine
    if (tileValues[index] === -1) {
      const newTileStates = onGameOverReveal(index, tileStates, tileValues);
      // TODO: setPrevTileState(TileState.LosingMine);
      return {
        ...state,
        interactionState: SessionState.GameOver,
        tileStates: newTileStates,
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
      // TODO: setPrevTileState(TileState.Revealed);
      return {
        ...state,
        ...updateUnrevealed(seed, newTileStates, nrUnrevealed - revealedTiles),
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
      ...updateUnrevealed(seed, newTileStates, nrUnrevealed - 1),
    };
  }

  function updateUnrevealed(
    seed: SessionSeed,
    tileStates: TileState[],
    newNrUnrevealed: number
  ) {
    let newTileStates: TileState[] = tileStates;
    let newInteractionState = SessionState.Idle;
    if (newNrUnrevealed === seed.nrMines) {
      newTileStates = flagMines(tileStates, seed.tileValues);
      newInteractionState = SessionState.Victory;
    }

    return {
      revealedOnce: newNrUnrevealed < seed.nrTiles,
      nrUnrevealed: newNrUnrevealed,
      interactionState: newInteractionState,
      tileStates: newTileStates,
    };
  }

  function toggleTileFlag(
    nrMines: number,
    state: Session,
    index: number,
    tState: TileState
  ) {
    if (tState === TileState.Hovered) {
      return {
        ...state,
        interactionState:
          state.nrFlags + 1 > nrMines
            ? SessionState.Confused
            : SessionState.JustFlagged,
        tileStates: changeSingleTile(
          state.tileStates,
          index,
          TileState.Flagged
        ),
        nrFlags: state.nrFlags + 1,
      };
    } else if (tState === TileState.Flagged) {
      return {
        ...state,
        interactionState: SessionState.Confused,
        tileStates: changeSingleTile(
          state.tileStates,
          index,
          TileState.Hovered
        ),
        nrFlags: state.nrFlags - 1,
      };
    }

    return state;
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

  // PROVIDER
  function SessionProvider({ children }: { children: React.ReactNode }) {
    const { store, dispatch } = useDepInjectedStore();

    return (
      <SessionContext.Provider value={store}>
        <SessionDispatchContext.Provider value={dispatch}>
          {children}
        </SessionDispatchContext.Provider>
      </SessionContext.Provider>
    );
  }

  function useDepInjectedStore() {
    const seed = useSessionSeed();

    const initialState = {
      interactionState: SessionState.Idle,
      tileStates: Array(seed.nrTiles).fill(TileState.Idle),
      revealedOnce: false,
      isLeftMouseDown: false,
      nrFlags: 0,
      nrUnrevealed: seed.nrTiles,
    };

    const depInjectedReducer = (state: Session, action: SessionAction) =>
      sessionReducer(seed, state, action);

    const [store, dispatch] = useReducer(depInjectedReducer, initialState);
    return { store, dispatch };
  }

  // CONSUMERS
  const useSession = () => validateConsumer(useContext(SessionContext));
  const useSessionDispatch = () =>
    validateConsumer(useContext(SessionDispatchContext));

  function validateConsumer(consumer: any) {
    if (consumer === undefined)
      throw new Error("consumer must be used within a StoreProvider");
    return consumer;
  }

  return [SessionProvider, useSession, useSessionDispatch];
}
