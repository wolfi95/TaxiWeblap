import { SET_ERROR_MSG, CLEAR_ERROR_MSG } from '../actionTypes/errorActionTypes'

export interface ISetErrorActionType {
    type: string,
    payload: string
}

export interface IClearErrorActionType {
    type: string
}

export const setError = (content: string): ISetErrorActionType => {
    return {
        type: SET_ERROR_MSG,
        payload: content
    }
};

export const clearError = (): IClearErrorActionType => {
    return {
        type: CLEAR_ERROR_MSG
    }
}

export type ErrorActionTypes = 
    ISetErrorActionType &
    IClearErrorActionType