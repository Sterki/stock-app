import { GET_PRODUCT_TO_EDIT } from "./../types";

const inisialState = {
  producttoedit: {},
};

export default (state = inisialState, action) => {
  switch (action.type) {
    case GET_PRODUCT_TO_EDIT:
      return {
        ...state,
        producttoedit: action.payload,
      };
    default:
      return state;
  }
};
