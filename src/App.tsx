import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";
import BodyFiller from "./components/shared/bodyFiller/BodyFiller";
import Nav from "./components/nav/Nav";
import Home from "./pages/home/Home";
import { useAppContext } from "./contexts/appContext/AppState";
import Poker from "./pages/poker/Poker";
import PokerRoom from "./pages/poker/pokerRoom/PokerRoom";
import { useMainSocket } from "./hooks/socket.io/useMainSocket";

function App() {
   const { appState } = useAppContext();
   const { fetchingAccessToken, accessToken } = appState;
   const { socket } = useMainSocket();
   const router = createBrowserRouter(
      createRoutesFromElements(
         fetchingAccessToken || !socket.id ? (
            <Route path="*" element={<BodyFiller loading />} />
         ) : (
            <Route path="/" element={<Nav />}>
               <Route index path="" element={<Home />}></Route>
               {accessToken && (
                  <>
                     <Route path="poker" element={<Poker />}>
                        <Route path=":rid" element={<PokerRoom />} />
                     </Route>
                  </>
               )}
               <Route path="*" element={<BodyFiller fillerMsg="Login First!" />} />
            </Route>
         )
      )
   );

   return <RouterProvider router={router} />;
}

export default App;

// {/* <Route path="properties" element={<ProtectedRoute component={Properties} />}> */}
// {/* <Route path="/unauthorized" element={<PageUnauthorized />} /> */}
// {/* <Route path="*" element={<PageNotFound />} /> */}
