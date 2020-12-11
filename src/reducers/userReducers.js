import { GET_USER_LOGEG, CLOSE_SESION } from "./../types";

const inisialState = {
  user: null,
};

export default (state = inisialState, action) => {
  switch (action.type) {
    case GET_USER_LOGEG:
      return {
        ...state,
        user: action.payload,
      };
    case CLOSE_SESION:
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
};
