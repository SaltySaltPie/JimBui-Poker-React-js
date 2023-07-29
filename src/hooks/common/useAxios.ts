import axios from "axios";
import { useAppContext } from "../../contexts/appContext/AppState";
import { useMainSocket } from "../socket.io/useMainSocket";

export const useAxios = () => {
   const { appState } = useAppContext();
   const { accessToken } = appState;
   const { socket } = useMainSocket(); 
   const Axios = axios.create({
      baseURL: process.env.REACT_APP_API,
      headers: { Authorization: `Bearer ${accessToken}`, socketid: socket.id },
   });
   return { Axios };
};
