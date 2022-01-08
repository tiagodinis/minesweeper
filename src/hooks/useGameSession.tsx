import { useEffect, useRef, useState } from "react";
import {
  Adjacency,
  Settings,
  SessionState,
  TileInteraction,
  TileState,
} from "../utils/sessionConstants";
import {
  flagMines,
  initTileValues,
  onGameOverReveal,
  revealNeighbours,
} from "../utils/minesweeperGrid";

export default function useGameSession() {
  const settings = useRef({ cols: 9, rows: 9, nrMines: 10 });

  const [cols, setCols] = useState(9);
  const [rows, setRows] = useState(9);
  const [nrMines, setNrMines] = useState(10);
  const nrTiles = cols * rows;
  const [sessionState, setSessionState] = useState(SessionState.Idle);
  const [revealedOnce, setRevealedOnce] = useState(false);
  const [nrFlags, setNrFlags] = useState(0);
  const [nrUnrevealed, setNrUnrevealed] = useState(nrTiles);
  // Tile value: what it holds inside (null for mine, [0-9] for mine adjacency info)
  // Tile state: how it can be interacted with (Flagged <--> Idle --> Revealed)
  const [tileValues, setTileValues] = useState<Adjacency[]>(() =>
    initTileValues(cols, rows, nrMines)
  );
  const [tileStates, setTileStates] = useState<TileState[]>(() =>
    Array(nrTiles).fill(TileState.Idle)
  );
  const isLeftMouseDown = useRef(false);
  const prevTileState = useRef(TileState.Idle);

  function handleTileInteraction(
    index: number,
    state: TileState,
    interaction: TileInteraction
  ) {
    // Don't handle interactions if the game "is not running"
    if (sessionState === SessionState.Victory) return;
    if (sessionState === SessionState.GameOver) return;

    // Hovering behavior
    if (interaction === TileInteraction.MouseEnter && state === TileState.Idle)
      setTileState(index, TileState.Hovered);
    else if (
      interaction === TileInteraction.MouseLeave &&
      state === TileState.Hovered
    )
      setTileState(index, TileState.Idle);
    // Clicking behavior
    else if (
      interaction === TileInteraction.LeftClick &&
      state === TileState.Hovered
    )
      setTileState(index, TileState.Revealed);
    else if (interaction === TileInteraction.RightClick) {
      if (state === TileState.Hovered) setTileState(index, TileState.Flagged);
      else if (state === TileState.Flagged)
        setTileState(index, TileState.Hovered);
    }
  }

  function setTileState(index: number, state: TileState) {
    if (state === TileState.Revealed) {
      // Mine
      if (tileValues[index] === -1) {
        const newTileStates = onGameOverReveal(index, tileStates, tileValues);
        setSessionState(SessionState.GameOver);
        setPrevTileState(TileState.LosingMine);
        setTileStates(newTileStates);
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
        updateUnrevealed(nrUnrevealed - revealedTiles);
        setPrevTileState(TileState.Revealed);
        setTileStates(newTileStates);
      }
      // Adjacent
      else {
        updateUnrevealed(nrUnrevealed - 1);
        changeSingleTile(index, state);
      }
    } else if (state === TileState.Flagged) {
      setNrFlags(nrFlags + 1);
      if (nrFlags + 1 > nrMines) setSessionState(SessionState.Confused);
      else setSessionState(SessionState.JustFlagged);
      changeSingleTile(index, state);
    } else if (state === TileState.Hovered) {
      if (tileStates[index] === TileState.Flagged) {
        setNrFlags(nrFlags - 1);
        setSessionState(SessionState.Confused);
      }
      changeSingleTile(index, state);
    } else if (state === TileState.Idle) changeSingleTile(index, state);
  }

  function changeSingleTile(index: number, state: TileState) {
    setPrevTileState(state);
    setTileStates((prev) => [
      ...prev.slice(0, index),
      state,
      ...prev.slice(index + 1),
    ]);
  }

  function setPrevTileState(state: TileState) {
    prevTileState.current = state;
    checkIfAnticipation();
  }

  function updateUnrevealed(newNrUnrevealed: number) {
    setRevealedOnce(newNrUnrevealed < nrTiles);
    setNrUnrevealed(newNrUnrevealed);
    if (newNrUnrevealed === nrMines) {
      setSessionState(SessionState.Victory);
      setTileStates(flagMines(tileStates, tileValues));
    } else setSessionState(SessionState.Idle);
  }

  function restartGameSession() {
    const { cols, rows, nrMines } = settings.current;
    setCols(cols);
    setRows(rows);
    setNrMines(nrMines);
    setSessionState(SessionState.Idle);
    setRevealedOnce(false);
    setNrFlags(0);
    setNrUnrevealed(cols * rows);
    setTileValues(initTileValues(cols, rows, nrMines));
    setTileStates(Array(cols * rows).fill(TileState.Idle));
    setPrevTileState(TileState.Idle);
  }

  function registerSettings(newSettings: Settings) {
    settings.current = newSettings;
    if (!revealedOnce) restartGameSession();
  }

  // Listen to left mouse state for Anticipation state
  useEffect(() => {
    const onLeftMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isLeftMouseDown.current = true;
        checkIfAnticipation();
      }
    };
    const onLeftMouseUp = (e: MouseEvent) => {
      if (e.button === 0) isLeftMouseDown.current = false;
    };
    window.addEventListener("mousedown", onLeftMouseDown);
    window.addEventListener("mouseup", onLeftMouseUp);
    return () => {
      window.removeEventListener("mousedown", onLeftMouseDown);
      window.removeEventListener("mouseup", onLeftMouseUp);
    };
  }, []);

  function checkIfAnticipation() {
    if (isLeftMouseDown.current && prevTileState.current === TileState.Hovered)
      setSessionState(SessionState.Anticipation);
    if (isLeftMouseDown.current && prevTileState.current === TileState.Idle)
      setSessionState(SessionState.Idle);
  }

  return {
    cols,
    rows,
    nrMines,
    registerSettings,
    sessionState,
    revealedOnce,
    nrFlags,
    tileValues,
    tileStates,
    restartGameSession,
    handleTileInteraction,
  };
}
