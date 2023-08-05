import { TPokerPlayerHand, TPokerRoom } from "../../../types/poker/types";
import Card from "../../shared/card/Card";
import Chip from "../../shared/chip/Chip";
import styles from "./PokerPlayerBox.module.scss";
const PokerPlayerBox = ({ player }: TPokerPlayerBoxProps) => {
   const { name,  hand, roundPot = 0,  inTurn, pos,  } = player;
   const { combo = [] } = hand || {};
   return (
      <div className={`${styles.contentC} ${(inTurn ) && styles.inTurn} `}>
         <div className={`${styles.name}`}>{name}</div>
         <div className={`${styles.cardsC}`}>
            {hand &&
               hand?.cards?.map((card, key) => (
                  <Card combo={!!card && combo.includes(card)} key={key} card={card} className={`${styles.card}`} />
               ))}
         </div>
         <div className={`${styles.pos} ${pos && styles[pos]}`}>{pos}</div>
         {roundPot > 0 && (
            <div className={`${styles.seat}`}>
               <Chip value={roundPot} />
            </div>
         )}
         {
            inTurn
         }
      </div>
   );
};

export default PokerPlayerBox;
type TPokerPlayerBoxProps = {
   player: TPokerPlayerBoxPlayer;
   room: TPokerRoom
   seat: number
};
export type TPokerPlayerBoxPlayer = {
   sub: string;
   name: string | null;
   hand?: Partial<TPokerPlayerHand> | null;
   pos?: "BB" | "SB" | "BT" | null;
   roundPot?: number;
   inTurn?: boolean;
};
