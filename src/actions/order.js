import axios from "axios";
import { SERVER_URL } from "../config/settings";
import {
  GET_DRIVER_ORDER_LIST,
  SEARCH_DRIVER_ORDER,
  CHANGE_ORDER_STATE_SUCCESS,
  SEARCH_DRIVER_ORDER_START,
} from "../constants/ActionTypes";
import i18n from "i18n-js";

export const getDriverOrderList = (data) => {
  return (dispatch) => {
    axios
      .post(SERVER_URL + "order/getCourierOrderListFull.php", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.message === "success") {
          const result = res.data.data.filter((order) =>
            ["4", "5", "6", "7"].includes(order.orderState)
          );

          dispatch({ type: GET_DRIVER_ORDER_LIST, payload: result });

          // dispatch({ type: GET_DRIVER_ORDER_LIST, payload: res.data.data });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const searchDriverOrder = (data) => {
  return (dispatch) => {
    dispatch({ type: SEARCH_DRIVER_ORDER_START });
    axios
      .post(SERVER_URL + "order/getCourierOrderByNumber.php", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.data.length === 0) {
          alert(i18n.t("No matching search result"));
        }
        dispatch({ type: SEARCH_DRIVER_ORDER, payload: res.data.data[0] });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const changeOrderState = (data) => {
  return (dispatch) => {
    axios
      .post(SERVER_URL + "order/courierChangeOrder.php", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: CHANGE_ORDER_STATE_SUCCESS, payload: res.data.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
