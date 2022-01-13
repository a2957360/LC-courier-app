import {
  SET_LANGUAGE_SUCCESS,
  GET_DRIVER_INFO_SUCCESS,
  CHANGE_DRIVER_NAME_AVATAR_SUCCESS,
  LOGIN_USER_SUCCESS,
  CLEAR_LOGIN_MESSAGE_SUCCESS,
} from "../constants/ActionTypes";

const INIT_STATE = {
  language: "En",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_LANGUAGE_SUCCESS: {
      return {
        ...state,
        language: action.payload,
      };
    }

    case GET_DRIVER_INFO_SUCCESS: {
      return {
        ...state,
        userInfo: action.payload,
      };
    }

    case CHANGE_DRIVER_NAME_AVATAR_SUCCESS: {
      return {
        ...state,
      };
    }

    case LOGIN_USER_SUCCESS: {
      return {
        ...state,
        userInfo: action.payload.data,
        loginMessage: action.payload.message,
        errorCode: action.payload.errorCode,
      };
    }

    case CLEAR_LOGIN_MESSAGE_SUCCESS: {
      return {
        ...state,
        userInfo: null,
        loginMessage: null,
        errorCode: null,
      };
    }

    default:
      return state;
  }
};
