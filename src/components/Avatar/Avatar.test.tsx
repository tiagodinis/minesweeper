import { render, screen } from "@testing-library/react";
import { SessionState } from "../../utils/sessionConstants";
import Avatar from "./Avatar";

// function checkStateRender(sessionState: SessionState, content: string) {
//   it(`renders ${sessionState} content`, () => {
//     render(<Avatar sessionState={sessionState} />);
//     const regex = new RegExp(content, "i");
//     expect(screen.getByRole("img", { name: regex })).toBeVisible();
//   });
// }

describe("Avatar", () => {
  // checkStateRender(SessionState.Idle, "happy");
  // checkStateRender(SessionState.Anticipation, "shocked");
  // checkStateRender(SessionState.JustFlagged, "smart");
  // checkStateRender(SessionState.Confused, "thinking");
  // checkStateRender(SessionState.Victory, "cool");
  // checkStateRender(SessionState.GameOver, "skull");
});
