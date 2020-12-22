import { combineReducers } from "redux";
import productReducer from "./productReducers";
import userReducers from "./userReducers";
import supplierReducers from "./supplierReducers";
import customerReducers from "./customerReducers";

export default combineReducers({
  products: productReducer,
  users: userReducers,
  suppliers: supplierReducers,
  customers: customerReducers,
});
