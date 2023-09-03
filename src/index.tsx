import React from "react";
import ReactDOM from "react-dom/client";
import "./global.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AppState from "./contexts/appContext/AppState";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "react-query";
import { IoProvider } from "socket.io-react-hook";
import InfoModal from "./components/shared/infoModal/InfoModal";
const queryClient = new QueryClient({
   defaultOptions: { queries: { refetchOnWindowFocus: false, refetchOnMount: false, retry: false } },
});
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
   <React.StrictMode>
      <Auth0Provider
         domain="dev-kj92tcix.jp.auth0.com"
         clientId="84ftcvjGh3nK2BdUJiapMQ47GqoI7Rqg"
         authorizationParams={{ redirect_uri: window.location.origin, audience: "casino-api" }}
         cacheLocation="localstorage"
         useRefreshTokens
      >
         <AppState>
            <IoProvider>
               <QueryClientProvider client={queryClient}>
                  <InfoModal />
                  <App />
               </QueryClientProvider>
            </IoProvider>
         </AppState>
      </Auth0Provider>
   </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
