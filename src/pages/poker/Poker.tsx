import styles from "./Poker.module.scss";
import { useQPokerRooms } from "../../hooks/querries/poker/useQPokerRooms";
import MainButton from "../../components/shared/mainButton/MainButton";
import { useMainSocket } from "../../hooks/socket.io/useMainSocket";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import BodyFiller from "../../components/shared/bodyFiller/BodyFiller";
const Poker = () => {
   const nav = useNavigate();
   const { socket } = useMainSocket();

   const { rid } = useParams();
   const { data: qPRoomsData, isFetching: qPRoomsFetching } = useQPokerRooms();
   const { rooms = [] } = qPRoomsData || {};

   if (qPRoomsFetching || !socket.connected) return <BodyFiller loading />;
   return (
      <div className={`${styles.contentC}`}>
         {rid == null ? (
            <div className={`${styles.roomsC} `}>
               <div className={`${styles.roomsTitle}`}>Select A Room</div>
               <ul className={`${styles.rooms}`}>
                  {rooms.map(({ rid, count }) => (
                     <li key={rid}>
                        <div className={`${styles.roomL}`}>
                           <div>Room: {rid}</div>
                           <div>Players: {count}</div>
                        </div>
                        <div className={`${styles.roomR}`}>
                           <MainButton title="Join" onClick={() => nav(`${rid}`)} />
                        </div>
                     </li>
                  ))}
               </ul>
            </div>
         ) : (
            <Outlet />
         )}
      </div>
   );
};

export default Poker;
type TPokerProps = {};
