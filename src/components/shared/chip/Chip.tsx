import styles from "./Chip.module.scss";
const Chip = ({ value, className, style }: TChipProps) => {
   const colorCode = value >= 100 ? 5 : value >= 50 ? 4 : value >= 20 ? 3 : value >= 10 ? 2 : value >= 5 ? 1 : 0;
   return (
      <div className={`${styles.contentC} ${styles[`color${colorCode}`]} ${className}`} style={style}>
         <div className={`${styles.inner}`}>{value}</div>
      </div>
   );
};

export default Chip;
type TChipProps = {
   value: number;
   className?: string;
   style?: React.CSSProperties;
};
