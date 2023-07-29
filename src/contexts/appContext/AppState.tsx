import { useAuth0 } from "@auth0/auth0-react";
import { FC, ReactNode, useContext, useEffect, useReducer } from "react";
import { appReducer, defaultAppState } from "./appReducer";
import AppContext from "./AppContext";

const AppState: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
   const [appState, appDispatch] = useReducer(appReducer, defaultAppState);
   const { accessToken } = appState;
   const { user, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
   useEffect(() => {
      const { REACT_APP_AUTH0_AUDIENCE } = process.env;
      const getAccessToken = async () => {
         appDispatch({ fetchingAccessToken: true });
         const newToken = await getAccessTokenSilently({
            authorizationParams: { audience: REACT_APP_AUTH0_AUDIENCE },
         });
         appDispatch({ accessToken: newToken, fetchingAccessToken: false });
      };
      if (user && !accessToken) getAccessToken();
   }, [user, accessToken, getAccessTokenSilently]);

   return <AppContext.Provider value={{ appState, appDispatch }}>{children}</AppContext.Provider>;
};

export default AppState;
export const useAppContext = () => useContext(AppContext);
