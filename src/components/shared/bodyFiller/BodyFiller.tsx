import SmallSpinner from "../smallSpinner/SmallSpinner";
import styles from "./BodyFiller.module.scss";
const BodyFiller = ({ fillerMsg, loading, style }: IBodyFillerProps) => {
   return (
      <div className={`${styles.contentC} `} style={style}>
         {loading ? <SmallSpinner /> : <div className={`${styles.msg}`}>{fillerMsg}</div>}
      </div>
   );
};

export default BodyFiller;
interface IBodyFillerProps {
   style?: React.CSSProperties;
   loading?: boolean;
   fillerMsg?: string;
}
