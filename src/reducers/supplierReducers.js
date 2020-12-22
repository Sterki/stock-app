import { GET_SUPPLIER_TO_EDIT } from "../types";

const inisialState = {
  suppliertoedit: {},
};

export default (state = inisialState, action) => {
  switch (action.type) {
    case GET_SUPPLIER_TO_EDIT:
      return {
        ...state,
        suppliertoedit: action.payload,
      };
    default:
      return state;
  }
};
