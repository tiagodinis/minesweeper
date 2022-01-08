import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: "Rubik", sans-serif;
    }

  body {
    background-color: ${({ theme }) => theme.BG};
  }
`;
