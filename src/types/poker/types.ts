export type TPokerPlayer = {
   sub: string;
   name: string | null;
};
export type TPokerPlayerAction = "call" | "fold" | "check" | "raise" | null;
export type TPokerRoom = {
   players: (TPokerPlayer | null)[];
   status: string;
   config: {
      timeoutMs: number;
   };
   data: {
      //@ ROOM LEVEL
      rid: number;
      created_by: string;
      created_at: string;
      scoreboard: TPokerScoreboardLine[];

      //@ GAME LEVEL
      status: "playing" | "idle";
      queued_actions: {
         sub: string;
         action: "stand-up";
      }[];
      game_players: (TPokerPlayer | null)[];
      community_cards: string[]; // [3h,Jd,As,Qc] (turn)
      player_hands: (TPokerPlayerHand | null)[]; //@SENSITIVE

      pot: number[]; // [60, null, null,60,60, null, null,60, null]
      stake: number; // 0
      //*                     0              3  4              7
      round_pot: number[]; //[30, null, null,30,30, null, null,30, null]
      round: "pre" | "flop" | "turn" | "river" | "post";
      nextTimeOut: number;

      sb_index: number; // sub2 : 3
      play_order: number[]; // sub index[] : [4 , 7, 0, 3] => [0 , 3, 4, 7]
      play_order_index: number; // order index : 0
      previous_player_action: TPokerPlayerAction;
      players_action: TPokerPlayerAction[];
      winnerSeats: number[];
   };
};

export type TPokerScoreboardLine = {
   sub: string;
   alpha: number;
   name: string;
};

export type TPokerRoomUser = {
   name: string;
   sub: string;
};
export type TPokerPlayerHand = {
   cards: (string | null)[];
   combo: string[];
   desc: string;
   name: string;
   show?: boolean;
};
