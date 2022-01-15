import { useEffect } from "react";
import { SessionActionType } from "../hooks/makeSessionStore";
import { useSessionDispatch } from "../stores/sessionStore";

export default function SessionDispatcher() {
  const dispatchSession = useSessionDispatch();

  useEffect(() => {
    const onLeftMouseDown = (e: MouseEvent) => {
      if (e.button === 0)
        dispatchSession({
          type: SessionActionType.LeftDown,
          payload: { index: 0 },
        });
    };
    const onLeftMouseUp = (e: MouseEvent) => {
      if (e.button === 0)
        dispatchSession({
          type: SessionActionType.LeftUp,
          payload: { index: 0 },
        });
    };

    window.addEventListener("mousedown", onLeftMouseDown);
    window.addEventListener("mouseup", onLeftMouseUp);
    return () => {
      window.removeEventListener("mousedown", onLeftMouseDown);
      window.removeEventListener("mouseup", onLeftMouseUp);
    };
  }, []);

  return null;
}
