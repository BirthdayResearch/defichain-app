import { RouteComponentProps } from "react-router-dom";

export interface AppState {
  prevDepth: Function;
}

export interface AppProps extends RouteComponentProps {
  isNodeRunning: boolean;
  loadSettings: Function;
}
