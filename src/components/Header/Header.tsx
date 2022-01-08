import { SessionState } from "../../utils/sessionConstants";
import styled from "styled-components";

type HeaderProps = {
  sessionState: SessionState;
  cols: number;
  rows: number;
  nrMines: number;
};

export default function Header({
  sessionState,
  cols,
  rows,
  nrMines,
}: HeaderProps) {
  function getTitleMsg() {
    if (sessionState === SessionState.Victory) return "You won!";
    if (sessionState === SessionState.GameOver) return "Boom!";
    return "Minesweeper";
  }

  function getSubtitleMsg() {
    if (sessionState === SessionState.Victory) {
      let mineStr = `mine${nrMines !== 1 ? "s" : ""}`;
      let density = nrMines / (cols * rows);
      let densityStr =
        density > 0.13 ? "nice" : density > 0.15 ? "awesome" : "ludicrous";
      return `A ${cols} x ${rows} grid with ${nrMines} ${mineStr}, ${densityStr}!`;
    } else if (sessionState === SessionState.GameOver)
      return "Better luck next time...";

    return "";
  }

  return (
    <S_Header>
      <S_Title>{getTitleMsg()}</S_Title>
      <S_Subtitle>{getSubtitleMsg()}</S_Subtitle>
    </S_Header>
  );
}

// STYLE
const S_Header = styled.header`
  padding-top: 16px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const S_Title = styled.h1`
  font-size: 64px;
  color: ${({ theme }) => theme.fontColor};
`;

const S_Subtitle = styled.h3`
  height: 20px;

  font-size: 18px;
  font-weight: 300;
  color: ${({ theme }) => theme.fontColor};
`;
