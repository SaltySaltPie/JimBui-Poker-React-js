import { useAppContext } from "../../../contexts/appContext/AppState";
import { useQuery } from "react-query";
import { useAxios } from "../../common/useAxios";
import { useMainSocket } from "../../socket.io/useMainSocket";
import { TUser } from "../../../types/user";

export const useQMyInfo = () => {
   const { appState } = useAppContext();
   const { fetchingAccessToken, accessToken } = appState;
   const { Axios } = useAxios();
   const { socket } = useMainSocket();
   const enabled = !fetchingAccessToken && !!accessToken && !!socket.id;
   return useQuery({
      enabled,
      queryKey: ["user", accessToken, socket.id],
      queryFn: () => Axios.get("/users/me").then<{ user: TUser }>(({ data }) => data),
   });
};
