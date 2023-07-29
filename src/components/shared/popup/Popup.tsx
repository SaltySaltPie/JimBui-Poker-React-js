import styles from "./Popup.module.scss";
const Popup = ({ children, handleClose }: IPopupParams) => {
   return (
      <section className={`${styles.contentC}`}>
         <div className={`${styles.screen}`} onClick={() => handleClose()}></div>
         {children}
      </section>
   );
};

export default Popup;

interface IPopupParams {
   handleClose: () => void;
   children: React.ReactNode;
}
