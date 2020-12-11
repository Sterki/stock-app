import { combineReducers } from "redux";
import productReducer from "./productReducers";
import userReducers from "./userReducers";

export default combineReducers({
  products: productReducer,
  users: userReducers,
});
