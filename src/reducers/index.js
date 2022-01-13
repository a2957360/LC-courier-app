import { combineReducers } from "redux";
import accountReducer from "./account";
import orderReducer from "./order";

export default combineReducers({
  accountData: accountReducer,
  orderData: orderReducer,
});
