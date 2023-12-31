import { useEffect, useRef, useState } from "react";
import { TPokerRoom } from "../../../types/poker/types";
import Card from "../../shared/card/Card";
import Chip from "../../shared/chip/Chip";
import styles from "./PokerPlayerBox.module.scss";
import { jsArrayGetAfterIndex } from "../../../utils/js/jsArrayGetAfterIndex";
import { jsArrayGetBeforeIndex } from "../../../utils/js/jsArrayGetBeforeIndex";
const PokerPlayerBox = ({ room, seat, msgs = [] }: TPokerPlayerBoxProps) => {
   const { data: roomData, players = [], config } = room;
   const { timeoutMs = 10000 } = config || {};
   const {
      round,
      game_players = [],
      sb_index,
      nextTimeOut,
      round_pot = [],
      play_order = [],
      play_order_index,
      player_hands = [],
      players_action = [],
      winnerSeats = [],
   } = roomData;
   const playerSeats = game_players
      .map((player, i) => (player ? i : null))
      .filter((seatIndex) => seatIndex != null) as number[];
   if (msgs.length > 0) console.log({ msgs });
   const player = players[seat];
   const { name } = player || {};
   const roundPot = round_pot[seat];
   const hand = player_hands[seat];
   const { combo = [], name: handName, show } = hand || {};

   const inTurn = play_order[play_order_index] === seat;
   const sbOrderIndex = playerSeats.findIndex((seatIndex) => seatIndex === sb_index);
   const boxAction = players_action[seat];
   const isWinner = winnerSeats.includes(seat);

   const bb_index = sb_index != null && jsArrayGetAfterIndex(playerSeats, sbOrderIndex);
   const bt_index = sb_index != null && jsArrayGetBeforeIndex(playerSeats, sbOrderIndex);
   const pos = bb_index === seat ? "BB" : sb_index === seat ? "SB" : bt_index === seat ? "BT" : "";

   const [timeLeft, setTimeLeft] = useState(0);
   const progressWidth = timeLeft > 0 ? (timeLeft / timeoutMs) * 100 : 0;
   const [msg, setMsg] = useState("");

   const clearMsgRef = useRef<NodeJS.Timeout | null>(null);
   const lastMsgRef = useRef("");
   useEffect(() => {
      const newMsg = msgs[0];
      if (newMsg && newMsg !== lastMsgRef.current) {
         lastMsgRef.current = newMsg;
         if (clearMsgRef.current) clearTimeout(clearMsgRef.current);
         setMsg(newMsg);
         clearMsgRef.current = setTimeout(() => setMsg(""), 2000);
      }
   }, [msgs]);

   useEffect(() => {
      let interval: NodeJS.Timer;
      if (inTurn) interval = setInterval(() => setTimeLeft(Math.max(nextTimeOut - Date.now(), 0)), 100);
      return () => interval && clearInterval(interval);
   }, [inTurn, nextTimeOut]);
   return (
      <div className={`${styles.contentC} ${inTurn && styles.inTurn}`}>
         <div className={`${styles.name}`}>{name}</div>
         <div className={`${styles.cardsC}`}>
            {hand ? (
               hand.cards?.map((card, key) => (
                  <Card combo={!!card && combo.includes(card)} key={key} card={card} className={`${styles.card}`} />
               ))
            ) : play_order.includes(seat) ? (
               <>
                  <Card card={null} className={`${styles.card}`} />
                  <Card card={null} className={`${styles.card}`} />
               </>
            ) : null}
         </div>
         <div className={`${styles.handName}`}>{handName}</div>
         {(boxAction || isWinner) && (
            <div className={`${styles.action} ${styles[`action-${boxAction}`]}`}>{isWinner ? "Winner" : boxAction}</div>
         )}
         <div className={`${styles.pos} ${pos && styles[pos]}`}>{pos}</div>
         {roundPot > 0 && (
            <div className={`${styles.chip}`}>
               <Chip value={roundPot} />
            </div>
         )}
         {inTurn && round !== "post" && (
            <div className={`${styles.progressC}`}>
               <div className={`${styles.progress}`} style={{ width: `${progressWidth}%` }}></div>
            </div>
         )}
         {show && <div className={`${styles.show}`}>SHOWN!</div>}
         <div className={`${styles.msgC}`}>{msg}</div>
      </div>
   );
};

export default PokerPlayerBox;
type TPokerPlayerBoxProps = {
   room: TPokerRoom;
   seat: number;
   msgs: string[];
};
// export type TPokerPlayerBoxPlayer = {
//    sub: string;
//    name: string | null;
//    hand?: Partial<TPokerPlayerHand> | null;
//    pos?: "BB" | "SB" | "BT" | null;
//    roundPot?: number;
//    inTurn?: boolean;
// };
