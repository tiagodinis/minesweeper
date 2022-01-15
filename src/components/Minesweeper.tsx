import Grid from "./Grid/Grid";
import styled from "styled-components";
import SettingsManager from "./Settings/SettingsManager";
import Avatar from "./Avatar/Avatar";
import Indicators from "./Indicators/Indicators";
import Header from "./Header/Header";
import { SessionSeedProvider } from "../stores/sessionSeedStore";
import { SessionProvider } from "../stores/sessionStore";
import SessionDispatcher from "./SessionDispatcher";

export default function Minesweeper() {
  return (
    <S_Minesweeper>
      <SessionSeedProvider>
        <SessionProvider>
          <SessionDispatcher />
          <Header />

          <S_BoardWrapper>
            <S_Board>
              <S_BoardHeader>
                <Indicators />
                <Avatar />
                {/*
                <SettingsManager
                  registerSettings={registerSettings}
                  restartGameSession={restartGameSession}
                /> */}
              </S_BoardHeader>

              <Grid />
            </S_Board>
          </S_BoardWrapper>
        </SessionProvider>
      </SessionSeedProvider>
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

const S_BoardWrapper = styled.div`
  flex-grow: 1;

  min-width: 460px;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const S_Board = styled.div`
  border-radius: 20px;
  background-color: ${({ theme }) => theme.boardBG};
  box-shadow: ${({ theme }) =>
    "4px 8px 16px " +
    theme.boardBGShadow +
    ", 8px 14px 32px " +
    theme.boardBGShadow};
`;

const S_BoardHeader = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.boardBGAccent};

  display: flex;
  justify-content: center;
  align-items: center;
`;
