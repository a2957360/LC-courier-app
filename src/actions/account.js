import axios from "axios";
import { SERVER_URL } from "../config/settings";
import {
  SET_LANGUAGE_SUCCESS,
  GET_DRIVER_INFO_SUCCESS,
  CHANGE_DRIVER_NAME_AVATAR_SUCCESS,
  LOGIN_USER_SUCCESS,
  CLEAR_LOGIN_MESSAGE_SUCCESS,
} from "../constants/ActionTypes";

//packages
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setLanguageCode = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_LANGUAGE_SUCCESS, payload: data });
  };
};

export const getDriverInfo = (data) => {
  return (dispatch) => {
    axios
      .get(`${SERVER_URL}courier/getCourierInfo.php?courierId=${data}`)
      .then((res) => {
        if (res.data.message === "success") {
          dispatch({
            type: GET_DRIVER_INFO_SUCCESS,
            payload: res.data.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const changeDriverNameAvatar = (data) => {
  return (dispatch) => {
    axios
      .post(SERVER_URL + "courier/changeCourierAvatarName.php", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({
          type: CHANGE_DRIVER_NAME_AVATAR_SUCCESS,
          payload: res.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const loginUser = (data) => {
  return (dispatch) => {
    axios
      .post(SERVER_URL + "courier/courierLogin.php", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("login result", res.data);
        if (res.data.message === "success") {
          AsyncStorage.setItem("userId", res.data.data.courierId);
        }
        dispatch({
          type: LOGIN_USER_SUCCESS,
          payload: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const clearLoginMessage = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_LOGIN_MESSAGE_SUCCESS,
    });
  };
};
