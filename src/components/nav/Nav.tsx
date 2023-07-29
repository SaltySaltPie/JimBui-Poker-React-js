import { useAuth0 } from "@auth0/auth0-react";
import styles from "./Nav.module.scss";
import { Link, Outlet, useNavigate } from "react-router-dom";
import MainButton from "../shared/mainButton/MainButton";
import { useSocketEvent } from "socket.io-react-hook";
import { useMainSocket } from "../../hooks/socket.io/useMainSocket";
import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/appContext/AppState";
import Popup from "../shared/popup/Popup";
import MainInput from "../shared/mainInput/MainInput";
import { useAxios } from "../../hooks/common/useAxios";
import SmallSpinner from "../shared/smallSpinner/SmallSpinner";
import { useQMyInfo } from "../../hooks/querries/user/useQMyInfo";
const Nav = () => {
   const { Axios } = useAxios();
   const { appState, appDispatch } = useAppContext();
   const { accessToken } = appState;
   const { loginWithRedirect, logout, isLoading, user: auth0User } = useAuth0();
   const nav = useNavigate();
   const { socket } = useMainSocket();
   const { lastMessage: sioKicked } = useSocketEvent(socket, "kicked");

   const { data: qMIData, isFetching: qMIFetching, refetch: qMIRefetch } = useQMyInfo();
   const { user } = qMIData || {};
   const { name } = user || {};

   const [newName, setNewName] = useState("");
   const [submitting, setSubmitting] = useState(false);
   const [showPopup, setShowPopup] = useState(false);

   useEffect(() => {
      if (sioKicked) {
         nav("/");
         appDispatch({ type: "pushInfoModal", payload: { msg: "You are logged in somewhere else!" } });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [sioKicked]);

   const handleSave = async () => {
      appDispatch({ type: "pushInfoModal", payload: { msg: "Updating Username" } });
      setSubmitting(true);
      try {
         await Axios.post(`/users/config/name`, { name: newName });
         appDispatch({ type: "pushInfoModal", payload: { type: "warn", msg: "Updating Username SUCCESS" } });
         qMIRefetch();
      } catch (error) {
         console.log({ error });
         appDispatch({ type: "pushInfoModal", payload: { msg: "Updating Username FAILED" } });
      }
      setShowPopup(false);
      setSubmitting(false);
   };

   return (
      <>
         {((!qMIFetching && !name && !!accessToken && !!socket.id) || showPopup) && (
            <Popup handleClose={() => {}}>
               <div className={`${styles.namePopUp}`}>
                  <MainInput value={newName} onChange={setNewName} title="Please Chose Your Name" charLimit={20} />
                  {submitting ? (
                     <SmallSpinner style={{ width: "1rem", height: "1rem" }} />
                  ) : (
                     <MainButton title="Save!" onClick={handleSave} />
                  )}
               </div>
            </Popup>
         )}
         <div className={`${styles.contentC}`}>
            <Link to={"/"}>Casino</Link>
            {qMIFetching || isLoading ? (
               <SmallSpinner style={{ width: "1rem", height: "1rem" }} />
            ) : auth0User ? (
               <div className={`${styles.userC}`}>
                  {submitting ? (
                     <SmallSpinner style={{ width: "1rem", height: "1rem" }} />
                  ) : (
                     <div className={`${styles.name}`} onClick={() => setShowPopup(true)}>
                        {name || "NONAME"}
                     </div>
                  )}

                  <MainButton type="bland" title="Log Out" onClick={logout} />
               </div>
            ) : (
               <button className={`${styles.loginC}`} onClick={() => loginWithRedirect()}>
                  Log In
               </button>
            )}
         </div>
         <Outlet />
      </>
   );
};

export default Nav;
