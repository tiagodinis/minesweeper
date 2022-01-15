import { createContext, Dispatch, useContext, useReducer } from "react";
import { SessionSeed, useSessionSeed } from "../stores/sessionSeedStore";
import { onGameOverReveal, revealNeighbours } from "../utils/minesweeperGrid";
import { SessionState, TileState } from "../utils/sessionConstants";

type Session = {
  interactionState: SessionState;
  tileStates: TileState[];
  revealedOnce: boolean;
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

    // Hovering
    if (tState === TileState.Idle && action.type === SessionActionType.Hover)
      return {
        ...state,
        tileStates: changeSingleTile(
          state.tileStates,
          tIndex,
          TileState.Hovered
        ),
      };

    if (
      tState === TileState.Hovered &&
      action.type === SessionActionType.Unhover
    )
      return {
        ...state,
        tileStates: changeSingleTile(state.tileStates, tIndex, TileState.Idle),
      };
    // Clicking
    if (
      tState === TileState.Hovered &&
      action.type === SessionActionType.LeftClick
    )
      return revealTile(seed, state, tIndex);
    if (action.type === SessionActionType.RightClick)
      return toggleTileFlag(state, tIndex, tState);

    return state;
  }

  function revealTile(seed: SessionSeed, state: Session, index: number) {
    const { cols, rows, tileValues } = seed;
    const { tileStates } = state;
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
      // changes:
      // * revealed once
      // * nrUnrevealed
      // * interactionState
      // updateUnrevealed(nrUnrevealed - revealedTiles);
      // TODO: setPrevTileState(TileState.Revealed);
      return { ...state, tileStates: newTileStates };
    }
    // Adjacent
    // TODO: updateUnrevealed(nrUnrevealed - 1);
    return {
      ...state,
      tileStates: changeSingleTile(state.tileStates, index, TileState.Revealed),
    };
  }

  // function updateUnrevealed(newNrUnrevealed: number) {
  //   return {
  //     revealedOnce: newNrUnrevealed < nrTiles,
  //     nrUnrevealed: newNrUnrevealed,
  //     interactionState:
  //   };

  //   if (newNrUnrevealed === nrMines) {
  //     setSessionState(SessionState.Victory);
  //     setTileStates(flagMines(tileStates, tileValues));
  //   } else setSessionState(SessionState.Idle);
  // }

  function toggleTileFlag(state: Session, index: number, tState: TileState) {
    if (tState === TileState.Hovered) {
      // TODO:
      // setNrFlags(nrFlags + 1);
      // if (nrFlags + 1 > nrMines) setSessionState(SessionState.Confused);
      // else setSessionState(SessionState.JustFlagged);
      return {
        ...state,
        tileStates: changeSingleTile(
          state.tileStates,
          index,
          TileState.Flagged
        ),
      };
    } else if (tState === TileState.Flagged) {
      // TODO:
      // setNrFlags(nrFlags - 1);
      // setSessionState(SessionState.Confused);
      return {
        ...state,
        tileStates: changeSingleTile(
          state.tileStates,
          index,
          TileState.Hovered
        ),
      };
    }

    return state;
  }

  // TODO: return only new tileStates array
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

    // return {
    //   ...state,
    //   tileStates: [
    //     ...state.tileStates.slice(0, index),
    //     newTileState,
    //     ...state.tileStates.slice(index + 1),
    //   ],
    // };
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
    const initialSession = useSessionSeed();

    const initialState = {
      interactionState: SessionState.Idle,
      tileStates: Array(initialSession.cols * initialSession.rows).fill(
        TileState.Idle
      ),
      revealedOnce: false,
      nrFlags: 0,
      nrUnrevealed: initialSession.cols * initialSession.rows,
    };

    const depInjectedReducer = (state: Session, action: SessionAction) =>
      sessionReducer(initialSession, state, action);

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
