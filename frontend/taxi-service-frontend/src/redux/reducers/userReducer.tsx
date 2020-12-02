import { SAVE_TOKEN, CLEAR_USER_STATE } from "../actionTypes/userActionTypes";
import { UserActionTypes } from "../actions/userActions";

export interface IUserState{
  token: string;
  email: string;
  userId: string;
  name: string;
}

const initialState: IUserState = {
   token: sessionStorage.getItem("token") ?? "",
   email: sessionStorage.getItem("email") ?? "",
   userId: sessionStorage.getItem("userId") ?? "",
   name: sessionStorage.getItem("name") ?? ""
};
  
export default function(state = initialState, action: UserActionTypes): IUserState {
  switch (action.type) {
    case SAVE_TOKEN: {
        sessionStorage.setItem("token", action.payload?.token ?? "");
        sessionStorage.setItem("email", action.payload?.email ?? "");
        sessionStorage.setItem("userId", action.payload?.userId ?? "");
        sessionStorage.setItem("name", action.payload?.name ?? "");
        return{
            ...state,
            token: action.payload?.token ?? "",
            email: action.payload?.email ?? "",
            userId: action.payload?.userId ?? "",
            name: action.payload?.name ?? ""
        }
    }
    case CLEAR_USER_STATE: {
      return initialState;
    }
    default:
      return state;
  }
}
  