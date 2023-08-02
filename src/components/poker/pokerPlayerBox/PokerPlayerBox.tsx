import { TPokerPlayerHand } from "../../../types/poker/types";
import Card from "../../shared/card/Card";
import styles from "./PokerPlayerBox.module.scss";
const PokerPlayerBox = ({ player }: TPokerPlayerBoxProps) => {
   const { name, lastAction = "", hand, roundPot = 0, totalPot = 0, inTurn, pos } = player;
   const { combo = [] } = hand || {};
   return (
      <div className={`${styles.contentC} ${inTurn && styles.inTurn}`}>
         <div className={`${styles.name}`}>{name}</div>
         <div className={`${styles.cardsC}`}>
            {hand &&
               hand?.cards?.map((card, key) => (
                  <Card combo={!!card && combo.includes(card)} key={key} card={card} className={`${styles.card}`} />
               ))}
         </div>
         <div className={`${styles.countC}`}>
            <span>T: {totalPot + roundPot}</span> | <span>R: {roundPot}</span>
         </div>
         <div className={`${styles.pos} ${pos && styles[pos]}`}>{pos}</div>
         <div className={`${styles.action} ${styles.lastAction}`}>{inTurn ? "Action" : lastAction}</div>
      </div>
   );
};

export default PokerPlayerBox;
type TPokerPlayerBoxProps = {
   player: TPokerPlayerBoxPlayer;
};
export type TPokerPlayerBoxPlayer = {
   sub: string;
   name: string | null;
   lastAction?: "call" | "check" | "fold" | "raise" | "";
   hand?: Partial<TPokerPlayerHand> | null;
   pos?: "BB" | "SB" | "BT" | null;
   roundPot?: number;
   totalPot?: number;
   inTurn?: boolean;
};
