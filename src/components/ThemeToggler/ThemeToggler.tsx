import { useState } from "react";
import { ReactComponent as SunSVG } from "../../assets/svg/sun.svg";
import { ReactComponent as MoonSVG } from "../../assets/svg/moon.svg";
import { Theme } from "../../styles/themes";
import styled, { useTheme } from "styled-components";
const lightOff = require("../../assets/audio/lightOff.mp3");
const lightOn = require("../../assets/audio/lightOn.mp3");

type ThemeTogglerProps = {
  setTheme: (t: Theme) => void;
};

export default function ThemeToggler({ setTheme }: ThemeTogglerProps) {
  const [toDarkSound] = useState(() => new Audio(lightOff));
  const [toLightSound] = useState(() => new Audio(lightOn));
  const theme = useTheme();

  function toggleTheme() {
    theme.id === Theme.Light ? toDarkSound.play() : toLightSound.play();
    setTheme(theme.id === Theme.Light ? Theme.Dark : Theme.Light);
  }

  return (
    <ToggleThemeButton onClick={toggleTheme}>
      {theme.id === Theme.Light && (
        <MoonSVG fill={theme.BG} stroke={theme.fontColor} />
      )}
      {theme.id === Theme.Dark && (
        <SunSVG fill={theme.BG} stroke={theme.fontColor} />
      )}
    </ToggleThemeButton>
  );
}

// STYLE
const ToggleThemeButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;

  width: 50px;
  height: 50px;

  padding: 10px;

  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.fontColor};
  background-color: ${({ theme }) => theme.BG};

  cursor: pointer;
`;
