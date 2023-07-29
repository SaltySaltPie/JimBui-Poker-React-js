import { useQuery } from "react-query";
import { useAxios } from "../../common/useAxios";
import { TPokerRoom } from "../../../types/poker/types";
import { useAppContext } from "../../../contexts/appContext/AppState";

export const useQPokerRooms = () => {
   const { Axios } = useAxios();
   const { appState } = useAppContext();
   const { accessToken } = appState;
   return useQuery({
      enabled: !!accessToken,
      queryKey: ["poker", "rooms"],
      queryFn: () => Axios.get("/poker/rooms").then<{ rooms: { rid: string; count: number }[] }>(({ data }) => data),
   });
};
