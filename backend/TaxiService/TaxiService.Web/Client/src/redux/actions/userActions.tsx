import { SAVE_TOKEN, CLEAR_USER_STATE, UPDATE_DATA } from "../actionTypes/userActionTypes";
import UserDto from "../../dtos/User/UserDto"
import ChangePersonalDataDtoDto from '../../dtos/Account/ChangePersonalDataDto'

export interface ISaveTokenActionType {
    type: string,
    payload?: UserDto
}

export interface IUpdateUserStateActionType {
    type: string,
    payload?: ChangePersonalDataDtoDto
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

export const updateUserState = (content: ChangePersonalDataDtoDto) => {
    return {
        type: UPDATE_DATA,
        payload: content
    }
}

export type UserActionTypes = 
    ISaveTokenActionType &
    IClearUserStateActionType &
    IUpdateUserStateActionType;