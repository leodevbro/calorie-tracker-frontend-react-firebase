import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { mockDb } from "./mockDb";

// console.log(mockDb);

// IMPORTANT START

// export enum AuthFlowEnum {
//   notLoggedIn = "notLoggedIn",
//   pleaseCompleteYourAccount = "pleaseCompleteYourAccount",
//   accountConfirmationInProgress = "accountConfirmationInProgress",
//   loggedIn = "loggedIn",
// }

// IMPORTANT END

//
//
//
//

export interface IFoodEntry {
  id: string;
  authorId: string;
  created: number; // milliseconds from the ERA
  intakeDateTime: number; // milliseconds from the ERA
  name: string;
  calories: number;
  dietCheat: boolean;
}

export interface IUserRoles {
  admin: boolean;
  user: boolean;
}

export interface ISiteUser {
  id: string;
  created: number; // milliseconds from the ERA
  firstName: string;
  lastName: string;
  email: string;
  roles: IUserRoles;
}

export type tyUserState = "" | null | ISiteUser; // // empty string means it is right now being determined the status of the user

export interface ISweetState {
  currUser: tyUserState;

  allUsers: ISiteUser[];

  showDevControl: boolean;

  toggleExpandAllUsers: boolean | null;

  showFullSidebarForDesktop: boolean;
  showSidebarForMobile: boolean;
}

export enum LSEnum {
  t_showDevControl = "t_showDevControl",

  t_showFullSidebarForDesktop = "t_showFullSidebarForDesktop",
  t_showSidebarForMobile = "t_showSidebarForMobile",
}

const showDevControlLocalStorage = (window.localStorage.getItem(LSEnum.t_showDevControl) ||
  "false") as "true" | "false";

const showFullSidebarForDesktopLocalStorage = (window.localStorage.getItem(
  LSEnum.t_showFullSidebarForDesktop,
) || "false") as "true" | "false";

const showSidebarForMobileLocalStorage = (window.localStorage.getItem(
  LSEnum.t_showSidebarForMobile,
) || "false") as "true" | "false";

const initialState: ISweetState = {
  currUser: "",

  allUsers: [],

  // userStatus: AuthFlowEnum.notLoggedIn,

  showDevControl: showDevControlLocalStorage === "true" ? true : false,

  toggleExpandAllUsers: null,

  showFullSidebarForDesktop: showFullSidebarForDesktopLocalStorage === "true" ? true : false,
  showSidebarForMobile: showSidebarForMobileLocalStorage === "true" ? true : false,
};

export const sweetSlice = createSlice({
  name: "sweet",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setCurrUser: (state, payload: PayloadAction<tyUserState>) => {
      const cand = payload.payload;
      state.currUser = cand;
    },

    changeShowDevControl: (state, payload: PayloadAction<boolean>) => {
      const cand = payload.payload;

      state.showDevControl = cand;
      window.localStorage.setItem(LSEnum.t_showDevControl, cand ? "true" : "false");
    },

    changeShowFullSidebarForDesktop: (state, payload: PayloadAction<boolean>) => {
      const cand = payload.payload;

      state.showFullSidebarForDesktop = cand;
      window.localStorage.setItem(LSEnum.t_showFullSidebarForDesktop, cand ? "true" : "false");
    },

    changeShowSidebarForMobile: (state, payload: PayloadAction<boolean>) => {
      const cand = payload.payload;

      state.showSidebarForMobile = cand;
      window.localStorage.setItem(LSEnum.t_showSidebarForMobile, cand ? "true" : "false");
    },

    // changeHighlightedUser: (state, payload: PayloadAction<null | string>) => {
    //   const cand = payload.payload;
    //   state.highlightedUserId = cand;
    // },

    changeToggleExpandAllUsers: (state, payload: PayloadAction<null | boolean | undefined>) => {
      const cand = payload.payload;
      const curr = state.toggleExpandAllUsers;
      state.toggleExpandAllUsers = cand !== undefined ? cand : !curr;
    },
  },
});

export const {
  setCurrUser,
  changeShowDevControl,
  changeShowFullSidebarForDesktop,
  changeShowSidebarForMobile,
  // changeHighlightedUser,
  changeToggleExpandAllUsers,
} = sweetSlice.actions;

export const sweetReducer = sweetSlice.reducer;

// export default counterSlice.reducer;
