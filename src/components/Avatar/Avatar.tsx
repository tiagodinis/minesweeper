import { SessionState } from "../../utils/sessionConstants";
import { ReactComponent as Happy } from "../../assets/svg/happy.svg";
import { ReactComponent as Shocked } from "../../assets/svg/shocked.svg";
import { ReactComponent as Smart } from "../../assets/svg/smart.svg";
import { ReactComponent as Thinking } from "../../assets/svg/thinking.svg";
import { ReactComponent as Cool } from "../../assets/svg/cool.svg";
import { ReactComponent as Skull } from "../../assets/svg/skull.svg";
import styled from "styled-components";
import { useSession } from "../../stores/sessionStore";

export default function Avatar() {
  const { interactionState } = useSession();

  function getEmoji() {
    if (interactionState === SessionState.Idle) return <Happy />;
    if (interactionState === SessionState.Anticipation) return <Shocked />;
    if (interactionState === SessionState.JustFlagged) return <Smart />;
    if (interactionState === SessionState.Confused) return <Thinking />;
    if (interactionState === SessionState.Victory) return <Cool />;
    if (interactionState === SessionState.GameOver) return <Skull />;
  }

  return <S_Avatar>{getEmoji()}</S_Avatar>;
}

// STYLE
const S_Avatar = styled.div`
  width: 120px;
  padding: 20px;
`;
