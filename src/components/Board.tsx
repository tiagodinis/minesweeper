import Avatar from "./Avatar/Avatar";
import Indicators from "./Indicators/Indicators";
import SettingsManager from "./Settings/SettingsManager";
import Grid from "./Grid/Grid";
import styled from "styled-components";

export default function Board() {
  return (
    <S_BoardWrapper>
      <S_Board>
        <S_BoardHeader>
          <Indicators />
          <Avatar />
          <SettingsManager />
        </S_BoardHeader>
        <Grid />
      </S_Board>
    </S_BoardWrapper>
  );
}

// STYLE
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
