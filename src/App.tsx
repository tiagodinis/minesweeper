import { lightTheme, darkTheme, Theme } from "./styles/themes";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyle";
import { useState } from "react";
import Minesweeper from "./components/Minesweeper";

export default function App() {
  const [theme, setTheme] = useState(Theme.Light);

  return (
    <ThemeProvider theme={theme === Theme.Light ? lightTheme : darkTheme}>
      <GlobalStyle />
      <Minesweeper setTheme={setTheme} />
    </ThemeProvider>
  );
}
