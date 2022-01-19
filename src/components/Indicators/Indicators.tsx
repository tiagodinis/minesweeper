import { useGameValues } from "../../stores/gameValuesStore";
import { useGameSession } from "../../stores/gameSessionStore";
import Timer from "../Timer/Timer";
import { ReactComponent as FlagSVG } from "../../assets/svg/flag.svg";
import { ReactComponent as NavalMineSVG } from "../../assets/svg/navalMine.svg";
import styled from "styled-components";

export default function Indicators() {
  const { nrMines } = useGameValues();
  const { nrFlags } = useGameSession();

  return (
    <S_Indicators>
      <Timer />
      <S_Counter>
        {nrFlags}
        <FlagSVG />
      </S_Counter>
      <S_Counter wrapAvatar iconTopOffset={-1}>
        {nrMines - nrFlags}
        <NavalMineSVG />
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
