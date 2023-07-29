import { useSocket } from "socket.io-react-hook";

export const useMainSocket = () => useSocket(process.env.REACT_APP_API)