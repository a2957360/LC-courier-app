import {
  GET_DRIVER_ORDER_LIST,
  SEARCH_DRIVER_ORDER,
  CHANGE_ORDER_STATE_SUCCESS,
  SEARCH_DRIVER_ORDER_START,
} from "../constants/ActionTypes";

const INIT_STATE = {};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DRIVER_ORDER_LIST: {
      return {
        ...state,
        driverOrderList: action.payload,
      };
    }

    case SEARCH_DRIVER_ORDER_START: {
      return {
        ...state,
        orderDetail: null,
      };
    }

    case SEARCH_DRIVER_ORDER: {
      return {
        ...state,
        orderDetail: action.payload,
      };
    }

    case CHANGE_ORDER_STATE_SUCCESS: {
      return {
        ...state,
      };
    }

    default:
      return state;
  }
};
