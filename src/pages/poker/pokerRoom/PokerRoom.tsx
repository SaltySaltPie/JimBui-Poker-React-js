import { useEffect, useState } from "react";
import MainInput from "../../../components/shared/mainInput/MainInput";
import styles from "./PokerRoom.module.scss";
import MainButton from "../../../components/shared/mainButton/MainButton";
import { useMainSocket } from "../../../hooks/socket.io/useMainSocket";
import { useSocketEvent } from "socket.io-react-hook";
import { TChatMsg } from "../../../types/chat";
import { useQPokerRoom } from "../../../hooks/querries/poker/useQPokerRoom";
import BodyFiller from "../../../components/shared/bodyFiller/BodyFiller";
import { useParams } from "react-router-dom";
import { useAxios } from "../../../hooks/common/useAxios";
import { useAppContext } from "../../../contexts/appContext/AppState";
import { useAuth0 } from "@auth0/auth0-react";
import { TPokerPlayer, TPokerRoom, TPokerScoreboardLine } from "../../../types/poker/types";
import Card from "../../../components/shared/card/Card";
import PokerPlayerBox from "../../../components/poker/pokerPlayerBox/PokerPlayerBox";
import SmallSpinner from "../../../components/shared/smallSpinner/SmallSpinner";
import { AxiosError } from "axios";
import { s3Link } from "../../../utils/aws/s3Link";
import { jsPlaySound } from "../../../utils/js/jsPlaySound";
const PokerRoom = () => {
   const { Axios } = useAxios();

   const { appDispatch } = useAppContext();
   const { user } = useAuth0();
   const { sub } = user || {};

   const [room, setRoom] = useState<TPokerRoom | null>(null);
   const [chat, setChat] = useState("");
   const [msgs, setMsgs] = useState<TChatMsg[]>([]);
   const [submitting, setSubmitting] = useState(false);
   const [showChat, setShowChat] = useState(false);
   const [showScore, setShowScore] = useState(false);
   const [raise, setRaise] = useState(1);

   const { rid } = useParams();

   const { socket } = useMainSocket();
   const { sendMessage: sioSendChat } = useSocketEvent(socket, "chat", {
      onMessage: (msg) => setMsgs((prev) => [msg, ...prev]),
   });
   useSocketEvent(socket, "updateRoom", { onMessage: (payload) => payload && setRoom(payload) });

   const { isFetching: qPkRFetching } = useQPokerRoom({});
   const { players = [], status, data: roomData } = room || {};

   const {
      community_cards = [],
      play_order = [],
      play_order_index = 0,
      round_pot = [],
      pot = [],
      player_hands = [],
      stake = 0,
      round,
      scoreboard = [],
      game_players = [],
      players_action = [],
      previous_player_action,
   } = roomData || {};
   console.log({player_hands})

   const seatedPlayers = players.filter(Boolean) as TPokerPlayer[];

   const isSeated = !!sub && seatedPlayers.map(({ sub }) => sub).includes(sub);
   const mySeatIndex = isSeated ? players.findIndex((player) => player?.sub === sub) : null;
   const myHand = mySeatIndex != null ? player_hands[mySeatIndex] : null;
   const { combo = [], show } = myHand || {};

   const iAmInTurn = mySeatIndex != null ? play_order[play_order_index] === mySeatIndex : null;
   const myRoundPot = mySeatIndex != null ? round_pot[mySeatIndex] : 0;
   const myTotalSpent = mySeatIndex != null ? (pot[mySeatIndex] || 0) + (round_pot[mySeatIndex] || 0) : 0;

   const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      sioSendChat(chat);
      setChat("");
      e.preventDefault();
   };
   const handleSit = async (seat: number) => {
      setSubmitting(true);
      appDispatch({ type: "pushInfoModal", payload: { msg: `Sitting at ${seat}` } });
      try {
         await Axios.post(`/poker/rooms/${rid}`, { seat });
         appDispatch({ type: "pushInfoModal", payload: { msg: `Sat at ${seat}` } });
      } catch (error) {
         console.log({ error });
         appDispatch({ type: "pushInfoModal", payload: { type: "warn", msg: `Failed at sitting at ${seat}` } });
      }
      setSubmitting(false);
   };
   const handleStandUp = async () => {
      setSubmitting(true);
      appDispatch({ type: "pushInfoModal", payload: { msg: `Standing Up` } });
      try {
         await Axios.delete(`/poker/rooms/${rid}`);
         appDispatch({ type: "pushInfoModal", payload: { msg: `Stood up` } });
      } catch (error) {
         console.log({ error });
         appDispatch({ type: "pushInfoModal", payload: { type: "warn", msg: `Failed at standing up` } });
      }
      setSubmitting(false);
   };
   const handleStart = async () => {
      setSubmitting(true);
      appDispatch({ type: "pushInfoModal", payload: { msg: `Requesting to start game!` } });
      sioSendChat("Requesting to start game!");
      try {
         await Axios.get(`/poker/rooms/${rid}/play`);
         appDispatch({ type: "pushInfoModal", payload: { msg: `Game Starting` } });
      } catch (error) {
         console.log({ error });
         appDispatch({ type: "pushInfoModal", payload: { type: "warn", msg: `Can't start game` } });
      }

      setSubmitting(false);
   };
   const handleAction = async (action: "call" | "fold" | "check" | "raise") => {
      setSubmitting(true);
      appDispatch({ type: "pushInfoModal", payload: { msg: `${action.toUpperCase()}` } });
      try {
         await Axios.post(`/poker/rooms/${rid}/play`, { action, raise });
         setRaise(1);
      } catch (error) {
         const err = error as AxiosError<any, { error: string; src: string }>;
         console.log({ msg: err?.response?.data?.error });
         appDispatch({
            type: "pushInfoModal",
            payload: { type: "warn", msg: `${action.toUpperCase()} failed: ${err.response?.data?.error}` },
         });
      }
      setSubmitting(false);
   };

   const handleRabbit = async () => {
      setSubmitting(true);
      appDispatch({ type: "pushInfoModal", payload: { msg: `Requesting to Rabbit Hunt!` } });
      try {
         await Axios.post(`/poker/rooms/${rid}/rabbit`);
      } catch (error) {
         const err = error as AxiosError<any, { error: string; src: string }>;
         console.log({ msg: err?.response?.data?.error });
         appDispatch({ type: "pushInfoModal", payload: { type: "warn", msg: `Can't request Rabbit Hunt` } });
      }
      setSubmitting(false);
   };
   const handleShow = async () => {
      setSubmitting(true);
      appDispatch({ type: "pushInfoModal", payload: { msg: `Requesting to show hand!` } });
      try {
         await Axios.post(`/poker/rooms/${rid}/show`);
      } catch (error) {
         const err = error as AxiosError<any, { error: string; src: string }>;
         console.log({ msg: err?.response?.data?.error });
         appDispatch({ type: "pushInfoModal", payload: { type: "warn", msg: `Can't request show hand` } });
      }
      setSubmitting(false);
   };

   const test = () => {};

   useEffect(() => {
      const checkSound = new Audio(s3Link(`/poker/sounds/check.mp3`));
      const callSound = new Audio(s3Link(`/poker/sounds/call.mp3`));
      const raiseSound = new Audio(s3Link(`/poker/sounds/raise.mp3`));
      const foldSound = new Audio(s3Link(`/poker/sounds/fold.mp3`));
      const chipsSound = new Audio(s3Link(`/poker/sounds/chips.mp3`));
      const knockSound = new Audio(s3Link(`/poker/sounds/knocking.mp3`));
      if (previous_player_action === "call") setTimeout(() => jsPlaySound(callSound), 1000);
      if (previous_player_action === "raise") setTimeout(() => jsPlaySound(raiseSound), 1000);
      if (["call", "raise"].includes(previous_player_action || "")) jsPlaySound(chipsSound);
      if (previous_player_action === "check") {
         jsPlaySound(knockSound);
         setTimeout(() => jsPlaySound(checkSound), 1000);
      }
      if (previous_player_action === "fold") jsPlaySound(foldSound);
   }, [previous_player_action, play_order]);

   useEffect(() => {
      const inTurnSound = new Audio(s3Link(`/poker/sounds/decide.mp3`));
      if (iAmInTurn) jsPlaySound(inTurnSound);
   }, [iAmInTurn]);

   if (qPkRFetching) return <BodyFiller loading />;
   if (!room) return <BodyFiller fillerMsg="Null Room" />;
   return (
      <section className={`${styles.contentC}`}>
         <article className={`${styles.gameC}`}>
            <div className={`${styles.roomInfoC} `}>
               <div className={`${styles.roomL}`}>
                  <div>Room: {rid}</div>
                  <div>Status: {status}</div>
               </div>
               <div className={`${styles.roomR}`}>
                  <MainButton title="test" onClick={test} />
                  {isSeated && <MainButton title="Stand Up" onClick={handleStandUp} />}
               </div>
            </div>
            <div className={`${styles.tableC}`}>
               <div className={`${styles.table} `}>
                  {[...Array(9)].map((_, i) => (
                     <div className={`${styles.seat}`} key={i}>
                        {players[i] ? (
                           <PokerPlayerBox room={room} seat={i} />
                        ) : isSeated ? (
                           <div>Empty</div>
                        ) : (
                           <MainButton title="Sit here" onClick={() => handleSit(i)} />
                        )}
                     </div>
                  ))}

                  {submitting ? (
                     <SmallSpinner />
                  ) : status === "idle" ? (
                     <div className={`${styles.idlePanelC}`}>
                        {seatedPlayers.length >= 2 ? (
                           <MainButton title="Start Game" onClick={handleStart} />
                        ) : (
                           <p>Waiting for more players</p>
                        )}
                     </div>
                  ) : (
                     <div className={`${styles.gameInfoC}`}>
                        <div>
                           <span style={{ textTransform: "uppercase" }}>[{round}]</span>
                           {myHand && <span>{myHand.desc}</span>}
                        </div>
                        <div className={`${styles.cardsC}`}>
                           {[...Array(5)].map((_, i) => (
                              <Card
                                 combo={combo.includes(community_cards[i])}
                                 card={community_cards[i]}
                                 key={i}
                                 className={`${styles.card}`}
                              />
                           ))}
                        </div>
                        <div>
                           <span>Pot: {pot.reduce((prev, curr) => prev + curr, 0)}</span> |{" "}
                           <span>Spent: {myTotalSpent}</span> | <span>Stake: {stake}</span>
                        </div>
                        {round === "post" && (
                           <div className={`${styles.postControls}`}>
                              {!show && <MainButton title="Show" onClick={handleShow} />}
                              {community_cards.length < 5 && <MainButton title="Rabbit" onClick={handleRabbit} />}
                           </div>
                        )}
                     </div>
                  )}
               </div>
               <div className={`${styles.controlsC}`}>
                  {iAmInTurn && stake != null && !submitting && (
                     <div className={`${styles.controls}`}>
                        <div className={`${styles.controlsRow}`}>
                           <MainButton title="Fold!" type="warn" onClick={() => handleAction("fold")} />
                           <MainButton
                              title={`Call ${stake - myRoundPot}`}
                              enabled={myRoundPot < stake}
                              onClick={() => handleAction("call")}
                           />
                           <MainButton
                              title={`Check`}
                              enabled={myRoundPot === stake}
                              onClick={() => handleAction("check")}
                           />
                        </div>
                        <div className={`${styles.controlsRow}`}>
                           <MainInput
                              title="Raise"
                              value={raise}
                              onChange={(str) => setRaise(Math.floor(Number(str)))}
                           />
                           <MainButton
                              title={`Raise to ${raise + stake}`}
                              type="warn"
                              enabled={raise > 0}
                              onClick={() => handleAction("raise")}
                           />
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </article>

         {showChat ? (
            <form className={`${styles.chatC}`} onSubmit={handleChatSubmit}>
               <ul className={`${styles.msgC}`}>
                  {msgs.map(({ msg, sender }, key) => (
                     <li key={key}>
                        <b>{sender}</b>: <span>{msg}</span>
                     </li>
                  ))}
               </ul>
               <div className={`${styles.chatControls}`}>
                  <MainButton title="Hide" type="warn" onClick={() => setShowChat(false)} />
                  <MainInput value={chat} onChange={setChat} charLimit={30} />
                  <MainButton submit title="SEND" />
               </div>
            </form>
         ) : (
            <MainButton title="Chat" onClick={() => setShowChat(true)} className={`${styles.chatBtn}`} />
         )}
         {showScore ? (
            <article className={`${styles.scoreC}`}>
               <div className={`${styles.titleC}`}>
                  <span>Scoreboard</span>
                  <MainButton title="Hide" type="warn" onClick={() => setShowScore(false)} />
               </div>
               <ul className={`${styles.scoreLines}`}>
                  {scoreboard.map(({ alpha, name, sub }, key) => (
                     <li key={key + sub}>
                        <b>{name}: </b>
                        <span className={`${styles[alpha > 0 ? "pos" : "nev"]}`}>
                           {alpha > 0 ? `+${alpha}` : alpha}
                        </span>
                     </li>
                  ))}
               </ul>
            </article>
         ) : (
            <MainButton title="Score" onClick={() => setShowScore(true)} className={`${styles.scoreBtn}`} />
         )}
      </section>
   );
};

export default PokerRoom;
