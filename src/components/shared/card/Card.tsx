import { s3Link } from "../../../utils/aws/s3Link";
import styles from "./Card.module.scss";
const Card = ({ card, style, className, combo }: TCardProps) => {
   const link = s3Link(`/cards/${card?.[1]}.svg`);
   return (
      <div
         className={`${styles.contentC} ${["d", "h"].includes(card?.[1] || "") && styles.red}
         ${combo && styles.combo} ${className}`}
         style={style}
      >
         {card ? (
            <>
               <div className={`${styles.top} `}>{card[0]}</div>
               <img src={link} alt="" className={`${styles.bot}`} />
            </>
         ) : (
            <div className={`${styles.back}`}>
               <div>?</div>
            </div>
         )}
      </div>
   );
};

export default Card;
type TCardProps = {
   card?: string | null;
   style?: React.CSSProperties;
   className?: string;
   combo?: boolean;
};
