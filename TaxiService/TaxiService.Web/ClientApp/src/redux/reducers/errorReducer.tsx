import { ErrorActionTypes } from '../actions/errorActions';
import { CLEAR_ERROR_MSG, SET_ERROR_MSG } from '../actionTypes/errorActionTypes';

export interface IErrorState{
    message: string;
  }
  
  const initialState: IErrorState = {
    message: ""
  };
    
  export default function(state = initialState, action: ErrorActionTypes): IErrorState {
    switch (action.type) {
      case SET_ERROR_MSG: {
          return {
              ...state,
              message: action.payload
          }
      }
      case CLEAR_ERROR_MSG: {
        return {
            ...state,
            message: ""
        }
    }
      default:
        return state;
    }
  }
    