import styles from "./MainButton.module.scss";
const MainButton = ({
   onClick = () => {},
   title,
   enabled = true,
   type = "main",
   submit,
   className,
}: TMainButtonProps) => {
   return (
      <button
         type={submit ? "submit" : "button"}
         className={`${styles.contentC} ${styles[type]} ${className}`}
         onClick={onClick}
         disabled={!enabled}
      >
         {title}
      </button>
   );
};

export default MainButton;
type TMainButtonProps = {
   onClick?: () => void;
   title?: string;
   enabled?: boolean;
   type?: "main" | "scnd" | "bland" | "warn";
   submit?: boolean;
   className?: string;
};
