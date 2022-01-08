import React from "react";
import { SessionState } from "../utils/sessionConstants";

export const WeeContext = React.createContext(SessionState.Idle);
