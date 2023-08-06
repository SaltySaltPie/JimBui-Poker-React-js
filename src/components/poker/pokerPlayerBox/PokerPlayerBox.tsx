import { useEffect, useState } from "react";
import { TPokerPlayerHand, TPokerRoom } from "../../../types/poker/types";
import Card from "../../shared/card/Card";
import Chip from "../../shared/chip/Chip";
import styles from "./PokerPlayerBox.module.scss";
const PokerPlayerBox = ({ room, seat }: TPokerPlayerBoxProps) => {
   const { data: roomData } = room;
   const {
      game_players = [],
      sb_index,
      nextTimeOut,
      round_pot = [],
      play_order = [],
      play_order_index,
      player_hands = [],
   } = roomData;
   const seatedPlayersSeatIndices = game_players
      .map((player, i) => (player ? i : null))
      .filter((seatIndex) => seatIndex != null) as number[];

   const player = game_players[seat];
   const { name } = player || {};
   const roundPot = round_pot[seat];
   const hand = player_hands[seat];

   const inTurn = play_order[play_order_index] === seat;
   const bb_index =
      sb_index != null &&
      seatedPlayersSeatIndices.at(seatedPlayersSeatIndices.findIndex((seatIndex) => seatIndex === sb_index) + 1);
   const bt_index =
      sb_index != null &&
      seatedPlayersSeatIndices.at(seatedPlayersSeatIndices.findIndex((seatIndex) => seatIndex === sb_index) - 1);
   const pos = bb_index === seat ? "BB" : bt_index === seat ? "BT" : sb_index === seat ? "SB" : "";
   const { combo = [] } = hand || {};

   const turnTime = 10000;
   const [timeLeft, setTimeLeft] = useState(0);
   const progressWidth = timeLeft > 0 ? (timeLeft / turnTime) * 100 : 0;

   useEffect(() => {
      let interval: NodeJS.Timer;
      if (nextTimeOut && inTurn) interval = setInterval(() => setTimeLeft(Math.floor(nextTimeOut - Date.now())), 100);
      return () => interval && clearInterval(interval);
   }, [inTurn, nextTimeOut]);

   return (
      <div className={`${styles.contentC} ${inTurn && styles.inTurn} `}>
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
         <div className={`${styles.pos} ${pos && styles[pos]}`}>{pos}</div>
         {roundPot > 0 && (
            <div className={`${styles.seat}`}>
               <Chip value={roundPot} />
            </div>
         )}
         {inTurn && (
            <div className={`${styles.progressC}`}>
               <div className={`${styles.progress}`} style={{ width: `${progressWidth}%` }}></div>
            </div>
         )}
      </div>
   );
};

export default PokerPlayerBox;
type TPokerPlayerBoxProps = {
   room: TPokerRoom;
   seat: number;
};
// export type TPokerPlayerBoxPlayer = {
//    sub: string;
//    name: string | null;
//    hand?: Partial<TPokerPlayerHand> | null;
//    pos?: "BB" | "SB" | "BT" | null;
//    roundPot?: number;
//    inTurn?: boolean;
// };
