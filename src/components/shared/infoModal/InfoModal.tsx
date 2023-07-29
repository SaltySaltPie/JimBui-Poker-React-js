import { useEffect } from "react";
import { useAppContext } from "../../../contexts/appContext/AppState";
import styles from "./InfoModal.module.scss";
const InfoModal = () => {
   const { appState, appDispatch } = useAppContext();
   const { infoModal } = appState;
   useEffect(() => {
      if (infoModal.length > 0)
         setTimeout(() => {
            appDispatch({ type: "shiftInfoModal" });
         }, 3000);
   }, [appDispatch, infoModal]);

   return (
      <ul className={`${styles.contentC}`}>
         {infoModal.map(({ type = "info", msg }, key) => (
            <li key={key} className={`${styles[type]}`}>
               {msg}
            </li>
         ))}
      </ul>
   );
};

export default InfoModal;
