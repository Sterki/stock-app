import {
  GET_CUSTOMER_TO_EDIT,
  GET_CUSTOMER_INFO,
  GET_CUSTOMER_ADDPRODUCT,
} from "./../types";

const inisialState = {
  customer: {},
  customerinfo: null,
  customerinfoadd: null,
};

export default (state = inisialState, action) => {
  switch (action.type) {
    case GET_CUSTOMER_TO_EDIT:
      return {
        ...state,
        customer: action.payload,
      };
    case GET_CUSTOMER_INFO:
      return {
        ...state,
        customerinfo: action.payload,
      };
    case GET_CUSTOMER_ADDPRODUCT:
      return {
        ...state,
        customerinfoadd: action.payload,
      };
    default:
      return state;
  }
};
