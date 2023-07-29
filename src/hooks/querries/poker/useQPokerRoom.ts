import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useAxios } from "../../common/useAxios";
import { useAppContext } from "../../../contexts/appContext/AppState";
import { useMainSocket } from "../../socket.io/useMainSocket";
import { TPokerRoom } from "../../../types/poker/types";

export const useQPokerRoom = ({ onSuccess = () => {} }: useQPokerRoomParams) => {
   const { Axios } = useAxios();
   const { rid } = useParams();
   const { appState, appDispatch } = useAppContext();
   const { accessToken } = appState;
   const { socket } = useMainSocket();

   return useQuery({
      enabled: rid != null && !!socket.id && !!accessToken,
      queryKey: ["poker-room", rid],
      refetchOnMount: true,
      queryFn: async () => {
         appDispatch({ type: "pushInfoModal", payload: { type: "info", msg: "Joining room " + rid } });
         let res: { room: TPokerRoom } | null = null;
         try {
            res = await Axios.get(`/poker/rooms/${rid}`).then<{ room: TPokerRoom }>(({ data }) => data);
            appDispatch({ type: "pushInfoModal", payload: { type: "info", msg: "Joined room " + rid } });
         } catch (error) {
            console.log({ error });
            appDispatch({ type: "pushInfoModal", payload: { type: "warn", msg: "Can't join room " + rid } });
         }
         return res;
      },
      onSuccess: (data) => !!data && onSuccess(data.room),
   });
};

type useQPokerRoomParams = {
   onSuccess?: (room: TPokerRoom) => void;
};
