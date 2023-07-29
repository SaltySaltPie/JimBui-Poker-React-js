import { Dispatch, createContext } from "react";
import { TAppReducer, TAppState, defaultAppState } from "./appReducer";

interface IappContext {
   appState: TAppState;
   appDispatch: Dispatch<TAppReducer>;
}
const AppContext = createContext<IappContext>({ appState: defaultAppState, appDispatch: () => {} });

export default AppContext;
