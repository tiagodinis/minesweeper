import ThemeToggler from "./ThemeToggler/ThemeToggler";
import { Theme } from "../styles/themes";
import useGameSession from "../hooks/useGameSession";
import Grid from "./Grid/Grid";
import styled from "styled-components";
import SettingsManager from "./Settings/SettingsManager";
import Avatar from "./Avatar/Avatar";
import Indicators from "./Indicators/Indicators";
import { SessionState } from "../utils/sessionConstants";
import Header from "./Header/Header";
import { SessionSeedProvider } from "../stores/sessionSeedStore";
import { SessionProvider } from "../stores/sessionStore";

type MinesweeperProps = {
  setTheme: (newTheme: Theme) => void;
};

export default function Minesweeper({ setTheme }: MinesweeperProps) {
  // const {
  //   cols,
  //   rows,
  //   nrMines,
  //   registerSettings,
  //   sessionState,
  //   revealedOnce,
  //   nrFlags,
  //   tileValues,
  //   tileStates,
  //   restartGameSession,
  //   handleTileInteraction,
  // } = useGameSession();

  return (
    <>
      <S_Minesweeper>
        <SessionSeedProvider>
          <SessionProvider>
            <Header />

            <S_BoardWrapper>
              <S_Board>
                <S_BoardHeader>
                  {/* <Indicators
                    nrMines={nrMines}
                    nrFlags={nrFlags}
                    revealedOnce={revealedOnce}
                    isRunning={
                      sessionState !== SessionState.Victory &&
                      sessionState !== SessionState.GameOver
                    }
                  /> */}
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

      <ThemeToggler setTheme={setTheme} />
    </>
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
