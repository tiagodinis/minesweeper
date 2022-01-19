import { memo } from "react";
import { Adjacency, TileState } from "../../utils/gameConstants";
import {
  GameActionType,
  useDispatchGameSession,
} from "../../stores/gameSessionStore";
import { ReactComponent as FlagSVG } from "../../assets/svg/flag.svg";
import { ReactComponent as NavalMineSVG } from "../../assets/svg/navalMine.svg";
import styled, { DefaultTheme, useTheme } from "styled-components";

type TileProps = {
  index: number;
  value: Adjacency;
  state: TileState;
};

export const Tile = memo(function Tile({ index, value, state }: TileProps) {
  const theme = useTheme();
  const dispatchGameSession = useDispatchGameSession();

  function getTileContent(state: TileState) {
    if (state === TileState.Flagged) return <FlagSVG fill={theme.fontColor} />;
    if (state === TileState.WrongFlag) return <FlagSVG />;
    if (state === TileState.LosingMine) return <NavalMineSVG />;
    if (state === TileState.Revealed && value === -1) return <NavalMineSVG />;
    if (state === TileState.Revealed && value > 0) return value;
  }

  const dispatchInteraction = (interactionType: GameActionType) =>
    dispatchGameSession({ type: interactionType, payload: { index: index } });

  return (
    <S_OuterTile
      onMouseUp={(e) => {
        if (e.button === 0) dispatchInteraction(GameActionType.LeftClick);
        else if (e.button === 2) dispatchInteraction(GameActionType.RightClick);
      }}
      onContextMenu={(e) => e.preventDefault()}
      onMouseEnter={() => dispatchInteraction(GameActionType.Hover)}
      onMouseLeave={() => dispatchInteraction(GameActionType.Unhover)}
      state={state}
    >
      <S_InnerTile state={state} value={value}>
        {getTileContent(state)}
      </S_InnerTile>
    </S_OuterTile>
  );
});

// STYLE
function getBGColor(theme: DefaultTheme, state: TileState) {
  if (state === TileState.Revealed) return theme.revealedTile;
  else if (state === TileState.LosingMine || state === TileState.WrongFlag)
    return theme.mistakeTile;
  else return theme.unrevealedTile; // Idle, Flagged or Hovered
}

function getBorder(theme: DefaultTheme, state: TileState) {
  if (state === TileState.Revealed) return `4px inset ${theme.revealedTile}`;
  else if (state === TileState.LosingMine)
    return `4px inset ${theme.mistakeTile}`;
  else if (state === TileState.WrongFlag)
    return `4px outset ${theme.mistakeTile}`;
  else if (state === TileState.Idle || state === TileState.Flagged)
    return `4px outset ${theme.unrevealedTile}`;
  else if (state === TileState.Hovered) return "none";
}

const S_OuterTile = styled.button<{ state: TileState }>`
  border: none;
  background: none;

  width: 40px;
  height: 40px;
  cursor: ${({ state }) =>
    state === TileState.Hovered ? "pointer" : "initial"};

  display: flex;
  justify-content: center;
  align-items: center;
`;

const S_InnerTile = styled.div<{ state: TileState; value: Adjacency }>`
  width: 36px;
  height: 36px;
  border-radius: 4px;
  padding: 5px;
  text-align: center;
  font-size: 18px;
  user-select: none;
  border: ${({ theme, state }) => getBorder(theme, state)};
  background-color: ${({ theme, state }) => getBGColor(theme, state)};
  color: ${({ theme, value }) => theme.adjacency(value)};
  font-weight: 800;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    position: relative;
    bottom: -1px;
  }
`;
