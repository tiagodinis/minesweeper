import { useEffect } from "react";
import {
  useDispatchGameSession,
  GameActionType,
} from "../stores/gameSessionStore";

export default function LeftMouseDownDispatcher() {
  const dispatchSession = useDispatchGameSession();

  useEffect(() => {
    const onLeftMouseDown = (e: MouseEvent) => {
      if (e.button === 0) dispatchSession({ type: GameActionType.LeftDown });
    };
    const onLeftMouseUp = (e: MouseEvent) => {
      if (e.button === 0) dispatchSession({ type: GameActionType.LeftUp });
    };

    window.addEventListener("mousedown", onLeftMouseDown);
    window.addEventListener("mouseup", onLeftMouseUp);
    return () => {
      window.removeEventListener("mousedown", onLeftMouseDown);
      window.removeEventListener("mouseup", onLeftMouseUp);
    };
  }, [dispatchSession]);

  return null;
}
