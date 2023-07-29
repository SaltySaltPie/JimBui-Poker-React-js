import styles from "./MainInput.module.scss";
const MainInput = <T,>({ onChange = () => {}, value, title, charLimit, style }: TMainInputProps<T>) => {
   return (
      <label className={`${styles.contentC}`} style={style}>
         <div className={`${styles.title}`}>{title}</div>
         <div className={`${styles.inputC}`}>
            <input
               // size={1}
               type={typeof value === "string" ? "text" : "number"}
               value={value as string}
               onChange={(e) => onChange(charLimit ? (e.target.value.slice(0, charLimit) as T) : (e.target.value as T))}
            />
            {charLimit && typeof value === "string" && (
               <div className={`${styles.charLimit} `}>
                  {value.length}/{charLimit}
               </div>
            )}
         </div>
      </label>
   );
};

export default MainInput;
type TMainInputProps<T> = {
   title?: string;
   value: T;
   onChange?: (v: T) => void;
   charLimit?: number;
   style?: React.CSSProperties;
};
