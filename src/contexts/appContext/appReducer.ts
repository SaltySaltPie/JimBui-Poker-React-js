import { TUnknownObj } from "../../types/common";

export type TAppInfoModal = {
   type: "info" | "error" | "warn";
   msg: string;
};

export type TAppState = {
   user: TUnknownObj;
   fetchingAccessToken: boolean;
   accessToken: string | null;
   infoModal: TAppInfoModal[];
};

export const defaultAppState: TAppState = {
   user: {},
   fetchingAccessToken: false,
   accessToken: null,
   infoModal: [],
};

export const appReducer = (state: TAppState, action: TAppReducer): TAppState => {
   // console.log({ action });
   if (!action.type) return { ...state, ...action };

   switch (action.type) {
      case "shiftInfoModal":
         return { ...state, infoModal: state.infoModal.slice(1) };
      case "pushInfoModal":
         return { ...state, infoModal: [...state.infoModal, action.payload] };
      default:
         console.log(`action is not supported`);
         return { ...state };
   }
};

export type TAppReducer = Partial<TAppState> & {
   type?: "shiftInfoModal" | "pushInfoModal";
   payload?: TAppInfoModal | any;
};
