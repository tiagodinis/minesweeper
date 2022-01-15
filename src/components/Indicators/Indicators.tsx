import Timer from "../Timer/Timer";
import styled from "styled-components";
import { ReactComponent as NavalMine } from "../../assets/svg/navalMine.svg";
import { ReactComponent as Flag } from "../../assets/svg/flag.svg";
import { useSessionSeed } from "../../stores/sessionSeedStore";
import { useSession } from "../../stores/sessionStore";

export default function Indicators() {
  const { nrMines } = useSessionSeed();
  const { nrFlags } = useSession();

  return (
    <S_Indicators>
      <Timer />
      <S_Counter>
        {nrFlags}
        <Flag />
      </S_Counter>
      <S_Counter wrapAvatar iconTopOffset={-1}>
        {nrMines - nrFlags}
        <NavalMine />
      </S_Counter>
    </S_Indicators>
  );
}

// STYLE
const S_Indicators = styled.div`
  min-width: 50px;
  max-width: 255px;
  flex-grow: 1;
  height: 106px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

export const S_Counter = styled.div<{
  wrapAvatar?: boolean;
  iconTopOffset?: number;
}>`
  position: relative;
  left: ${({ wrapAvatar }) => (wrapAvatar ? "14px" : "0px")};

  svg {
    position: relative;
    top: ${({ iconTopOffset }) => iconTopOffset}px;

    margin-left: 4px;
    width: 20px;
    fill: #1a1a1a;
  }

  display: flex;
  justify-content: center;
  align-items: center;
`;
