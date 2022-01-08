import { SessionState } from "../../utils/sessionConstants";
import { ReactComponent as Happy } from "../../assets/svg/happy.svg";
import { ReactComponent as Shocked } from "../../assets/svg/shocked.svg";
import { ReactComponent as Smart } from "../../assets/svg/smart.svg";
import { ReactComponent as Thinking } from "../../assets/svg/thinking.svg";
import { ReactComponent as Cool } from "../../assets/svg/cool.svg";
import { ReactComponent as Skull } from "../../assets/svg/skull.svg";
import styled from "styled-components";

type AvatarProps = {
  sessionState: SessionState;
};

export default function Avatar({ sessionState }: AvatarProps) {
  function getEmoji() {
    if (sessionState === SessionState.Idle) return <Happy />;
    if (sessionState === SessionState.Anticipation) return <Shocked />;
    if (sessionState === SessionState.JustFlagged) return <Smart />;
    if (sessionState === SessionState.Confused) return <Thinking />;
    if (sessionState === SessionState.Victory) return <Cool />;
    if (sessionState === SessionState.GameOver) return <Skull />;
  }

  return <S_Avatar>{getEmoji()}</S_Avatar>;
}

// STYLE
const S_Avatar = styled.div`
  width: 120px;
  padding: 20px;
`;
