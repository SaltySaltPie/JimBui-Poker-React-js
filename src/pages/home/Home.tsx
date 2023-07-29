import { Link } from "react-router-dom";
import MainButton from "../../components/shared/mainButton/MainButton";
import styles from "./Home.module.scss";
const Home = () => {
   return (
      <div className={`${styles.contentC}`}>
         <Link to={"poker"}>
            <MainButton title="Play Poker" />
         </Link>
      </div>
   );
};

export default Home;
type THomeProps = {};
