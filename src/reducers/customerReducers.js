import { GET_CUSTOMER_TO_EDIT } from "./../types";

const inisialState = {
  customer: {},
};

export default (state = inisialState, action) => {
  switch (action.type) {
    case GET_CUSTOMER_TO_EDIT:
      return{
        ...state,
        customer: action.payload
      }
    default:
      return state;
  }
};
