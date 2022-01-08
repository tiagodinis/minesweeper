import { useRef, useState } from "react";
import styled from "styled-components";
import {
  Difficulty,
  DifficultySettings,
  Settings,
} from "../../utils/sessionConstants";
import { ReactComponent as NavalMine } from "../../assets/svg/navalMine.svg";
import { ReactComponent as Grid } from "../../assets/svg/grid.svg";
import { clamp } from "../../utils/math";

type SettingsManagerProps = {
  registerSettings: (settings: Settings) => void;
  restartGameSession: () => void;
};

export default function SettingsManager({
  registerSettings,
  restartGameSession,
}: SettingsManagerProps) {
  const [difficulty, setDifficulty] = useState(Difficulty.Easy);
  const [settings, setSettings] = useState(DifficultySettings[difficulty]);
  const firstParamRef = useRef<HTMLInputElement>(null);

  function handleDifficultyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const dif = e.target.value;
    if (
      !(
        dif === Difficulty.Easy ||
        dif === Difficulty.Medium ||
        dif === Difficulty.Hard ||
        dif === Difficulty.Custom
      )
    )
      return;

    setDifficulty(Difficulty[dif]);
    if (Difficulty[dif] === Difficulty.Custom) firstParamRef.current?.focus();
    else {
      setSettings(DifficultySettings[dif]);
      registerSettings(DifficultySettings[dif]);
    }
  }

  function handleParamChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    let setting = parseInt(e.target.value);
    if (!setting) return;

    if (index !== 2) setting = clamp(setting, 1, 24);

    const settingKey = Object.keys(settings)[index];
    let newSettings = { ...settings, [settingKey]: setting };

    // Make sure mines are in range [1, cols * rows]
    newSettings.nrMines = clamp(
      newSettings.nrMines,
      1,
      newSettings.cols * newSettings.rows
    );

    setSettings(newSettings);
    registerSettings(newSettings);
  }

  const difficultyOption = (dif: Difficulty) => (
    <>
      <input
        type="radio"
        value={dif}
        name="difficulty"
        checked={dif === difficulty}
        id={dif}
        onChange={handleDifficultyChange}
      />
      <label htmlFor={dif}>{dif}</label>
    </>
  );

  const setting = (index: number, value: number) => (
    <S_DifficultyParam
      ref={index === 0 ? firstParamRef : null}
      type="number"
      min="1"
      max="20"
      value={value}
      readOnly={difficulty !== "Custom"}
      difficulty={difficulty}
      onChange={(e) => handleParamChange(e, index)}
    />
  );

  return (
    <S_GameSettings>
      <S_DifficultySelect>
        {difficultyOption(Difficulty.Easy)}
        {difficultyOption(Difficulty.Medium)}
        {difficultyOption(Difficulty.Hard)}
        {difficultyOption(Difficulty.Custom)}
      </S_DifficultySelect>
      <S_BottomRow>
        <S_NewGameBtn onClick={restartGameSession}>Restart</S_NewGameBtn>
        <S_SessionDetails>
          {setting(0, settings.cols)}x{setting(1, settings.rows)}
          <S_ParamIconWrapper>
            <Grid fill={"#1a1a1a"} />
          </S_ParamIconWrapper>
          {setting(2, settings.nrMines)}
          <S_ParamIconWrapper>
            <NavalMine fill={"#1a1a1a"} />
          </S_ParamIconWrapper>
        </S_SessionDetails>
      </S_BottomRow>
    </S_GameSettings>
  );
}

// STYLE
const S_GameSettings = styled.div`
  margin-right: 14px;

  height: 90px;
  width: 255px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const S_DifficultySelect = styled.div`
  display: inline-flex;
  overflow: hidden;
  background: ${({ theme }) => theme.boardBG};
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);

  input {
    display: none;
  }

  input:checked + label {
    background: ${({ theme }) => theme.boardBGAccent};
  }

  label {
    margin: 3px;
    padding: 4px 8px;

    border-radius: 4px;

    font-size: 14px;
    color: white;
    cursor: pointer;
  }
`;

const S_BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const S_NewGameBtn = styled.button`
  border: none;
  color: white;
  padding: 12px 16px;
  font-size: 16px;
  cursor: pointer;

  background: ${({ theme }) => theme.boardBG};
  border-radius: 4px;
  box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
  }

  transition: transform 0.1s, box-shadow 0.1s;
`;

const S_SessionDetails = styled.div`
  display: flex;
  justify-content: space-between;
`;

const S_DifficultyParam = styled.input<{ difficulty: Difficulty }>`
  border-radius: 5px;
  outline: none;
  user-select: none;
  border: none;
  background: ${({ difficulty, theme }) =>
    difficulty === Difficulty.Custom ? theme.boardBGAccent : "none"};

  -webkit-appearance: none;
  -ms-appearance: none;
  -moz-appearance: textfield;
  appearance: textfield;
  margin: 0;

  text-align: center;

  width: 30px;
`;

const S_ParamIconWrapper = styled.div`
  width: 20px;
  height: 20px;
`;
