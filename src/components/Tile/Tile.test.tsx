import React from "react";
import { render, screen } from "@testing-library/react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "../../styles/themes";
import {
  TileState,
  Adjacency,
  TileInteraction,
} from "../../utils/sessionConstants";
import { Tile } from "./Tile";
import userEvent from "@testing-library/user-event";

// function renderWithTheme(
//   ui: React.ReactElement,
//   theme: DefaultTheme = lightTheme,
//   { ...options } = {}
// ) {
//   const Wrapper = ({ children }: { children: React.ReactNode }) => (
//     <ThemeProvider theme={theme}>{children}</ThemeProvider>
//   );
//   return render(ui, { wrapper: Wrapper, ...options });
// }

// function checkPositiveAdjacencyRender(
//   value: Adjacency,
//   rerender: (ui: React.ReactElement) => void
// ) {
//   rerender(
//     <Tile
//       value={value}
//       state={TileState.Revealed}
//       handleInteraction={jest.fn()}
//     />
//   );
//   expect(screen.getByRole("button")).toHaveTextContent(value.toString());
//   expect(screen.getByTestId("inner-tile")).toHaveStyle(`
//     background-color: ${lightTheme.revealedTile};
//   `);
// }

// function checkStateRender(
//   state: TileState,
//   content: string,
//   theme: DefaultTheme,
//   bgColor: string
// ) {
//   it(`renders appropriate ${state} ${
//     theme === lightTheme ? "lightTheme" : "darkTheme"
//   }`, () => {
//     renderWithTheme(
//       <Tile value={1} state={state} handleInteraction={jest.fn()} />,
//       theme
//     );

//     expect(screen.getByRole("button")).toHaveTextContent(content);
//     expect(screen.getByTestId("inner-tile")).toHaveStyle(
//       `background-color: ${bgColor};`
//     );

//     if (content.length > 0) {
//       const regex = new RegExp(content, "i");
//       // eslint-disable-next-line jest/no-conditional-expect
//       expect(screen.getByRole("img", { name: regex })).toBeVisible();
//       // eslint-disable-next-line jest/no-conditional-expect
//     } else expect(screen.queryByRole("img")).toBeNull();
//   });
// }

// describe("Tile", () => {
//   it("renders appropriate content when revealed", () => {
//     // Revealed mine
//     const { rerender } = renderWithTheme(
//       <Tile
//         value={-1}
//         state={TileState.Revealed}
//         handleInteraction={jest.fn()}
//       />
//     );
//     expect(screen.getByRole("img", { name: /mine/i })).toBeVisible();

//     // Revealed empty tile
//     rerender(
//       <Tile
//         value={0}
//         state={TileState.Revealed}
//         handleInteraction={jest.fn()}
//       />
//     );
//     expect(screen.getByRole("button")).toHaveTextContent("");

//     // Positive adjacency
//     checkPositiveAdjacencyRender(1, rerender);
//     checkPositiveAdjacencyRender(2, rerender);
//     checkPositiveAdjacencyRender(3, rerender);
//     checkPositiveAdjacencyRender(4, rerender);
//     checkPositiveAdjacencyRender(5, rerender);
//     checkPositiveAdjacencyRender(6, rerender);
//     checkPositiveAdjacencyRender(7, rerender);
//     checkPositiveAdjacencyRender(8, rerender);
//   });

//   // Idle
//   checkStateRender(TileState.Idle, "", lightTheme, lightTheme.unrevealedTile);
//   checkStateRender(TileState.Idle, "", darkTheme, darkTheme.unrevealedTile);

//   // Hovered
//   checkStateRender(
//     TileState.Hovered,
//     "",
//     lightTheme,
//     lightTheme.unrevealedTile
//   );
//   checkStateRender(TileState.Hovered, "", darkTheme, darkTheme.unrevealedTile);

//   // Flagged
//   checkStateRender(
//     TileState.Flagged,
//     "flag",
//     lightTheme,
//     lightTheme.unrevealedTile
//   );
//   checkStateRender(
//     TileState.Flagged,
//     "flag",
//     darkTheme,
//     darkTheme.unrevealedTile
//   );

//   // WrongFlag
//   checkStateRender(
//     TileState.WrongFlag,
//     "flag",
//     lightTheme,
//     lightTheme.mistakeTile
//   );
//   checkStateRender(
//     TileState.WrongFlag,
//     "flag",
//     darkTheme,
//     darkTheme.mistakeTile
//   );

//   // LosingMine
//   checkStateRender(
//     TileState.LosingMine,
//     "mine",
//     lightTheme,
//     lightTheme.mistakeTile
//   );
//   checkStateRender(
//     TileState.LosingMine,
//     "mine",
//     darkTheme,
//     darkTheme.mistakeTile
//   );

//   it("registers correct interactions", () => {
//     const hI = jest.fn((interaction: TileInteraction) => interaction);
//     const state = TileState.Idle;

//     renderWithTheme(<Tile value={1} state={state} handleInteraction={hI} />);

//     userEvent.click(screen.getByRole("button"), { button: 0 });
//     userEvent.click(
//       screen.getByRole("button"),
//       { button: 2 },
//       { skipHover: true }
//     );
//     userEvent.unhover(screen.getByRole("button"));

//     expect(hI).toHaveBeenCalledTimes(4);
//     expect(hI).toHaveNthReturnedWith(1, TileInteraction.MouseEnter);
//     expect(hI).toHaveNthReturnedWith(2, TileInteraction.LeftClick);
//     expect(hI).toHaveNthReturnedWith(3, TileInteraction.RightClick);
//     expect(hI).toHaveNthReturnedWith(4, TileInteraction.MouseLeave);
//   });
// });
