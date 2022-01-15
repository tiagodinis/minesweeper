import { useSessionSeed } from "../../stores/sessionSeedStore";
import { useSession } from "../../stores/sessionStore";
import { Tile } from "../Tile/Tile";
import styled from "styled-components";

export default function Grid() {
  const { cols, rows, tileValues } = useSessionSeed();
  const { tileStates } = useSession();

  // console.log("Grid");

  return (
    <S_OuterGrid>
      <S_Grid cols={cols} rows={rows}>
        {tileValues.map((tv, index) => (
          <Tile
            key={index}
            index={index}
            value={tv}
            state={tileStates[index]}
          />
        ))}
      </S_Grid>
    </S_OuterGrid>
  );
}

// STYLE
const S_OuterGrid = styled.div`
  padding: 32px;
`;

const S_Grid = styled.div<{ cols: number; rows: number }>`
  margin: auto;

  display: grid;
  width: ${({ cols }) => `${cols * 40}px`};
  height: ${({ rows }) => `${rows * 40}px`};
  grid-template-rows: repeat(${({ rows }) => rows}, 1fr);
  grid-template-columns: repeat(${({ cols }) => cols}, 1fr);
  grid-gap: 0px;
`;
