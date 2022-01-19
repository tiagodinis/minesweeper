import { useGameSession } from "../../stores/gameSessionStore";
import { InteractionState } from "../../utils/gameConstants";
import { ReactComponent as HappySVG } from "../../assets/svg/happy.svg";
import { ReactComponent as ShockedSVG } from "../../assets/svg/shocked.svg";
import { ReactComponent as SmartSVG } from "../../assets/svg/smart.svg";
import { ReactComponent as ThinkingSVG } from "../../assets/svg/thinking.svg";
import { ReactComponent as CoolSVG } from "../../assets/svg/cool.svg";
import { ReactComponent as SkullSVG } from "../../assets/svg/skull.svg";
import styled from "styled-components";

const interactionEmojiMap = new Map([
  [InteractionState.Idle, <HappySVG />],
  [InteractionState.Anticipation, <ShockedSVG />],
  [InteractionState.JustFlagged, <SmartSVG />],
  [InteractionState.Confused, <ThinkingSVG />],
  [InteractionState.Victory, <CoolSVG />],
  [InteractionState.GameOver, <SkullSVG />],
]);

export default function Avatar() {
  const { interactionState } = useGameSession();
  return <S_Avatar>{interactionEmojiMap.get(interactionState)}</S_Avatar>;
}

// STYLE
const S_Avatar = styled.div`
  width: 120px;
  padding: 20px;
`;
