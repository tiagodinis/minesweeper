import { GameValuesProvider } from "../stores/gameValuesStore";
import { GameSessionProvider } from "../stores/gameSessionStore";
import LeftMouseDownDispatcher from "./LeftMouseDownDispatcher";
import Header from "./Header/Header";
import Board from "./Board";
import styled from "styled-components";

export default function Minesweeper() {
  return (
    <S_Minesweeper>
      <GameValuesProvider>
        <GameSessionProvider>
          <LeftMouseDownDispatcher />
          <Header />
          <Board />
        </GameSessionProvider>
      </GameValuesProvider>
    </S_Minesweeper>
  );
}

// STYLE
const S_Minesweeper = styled.div`
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
`;
