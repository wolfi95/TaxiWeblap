import { SAVE_TOKEN, CLEAR_USER_STATE } from "../actionTypes/userActionTypes";
import UserDto from "../../dtos/User/UserDto"

export interface ISaveTokenActionType {
    type: string,
    payload?: UserDto
}

export interface IClearUserStateActionType {
    type: string
}

export const saveToken = (content: UserDto): ISaveTokenActionType => {
    return {
        type: SAVE_TOKEN,
        payload: content
    }
};

export const clearUserState = (): IClearUserStateActionType => {
    return {
        type: CLEAR_USER_STATE
    }
}

export type UserActionTypes = 
    ISaveTokenActionType &
    IClearUserStateActionType;