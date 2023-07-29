import styles from "./SmallSpinner.module.scss";
const SmallSpinner = ({ style, className }: ISmallSpinnerParams) => {
   return (
      <div className={`${styles["lds-ring"]} ${className}`} style={style}>
         <div></div>
         <div></div>
         <div></div>
         <div></div>
      </div>
   );
};

export default SmallSpinner;

interface ISmallSpinnerParams {
   style?: React.CSSProperties;
   className?: string;
}
