import { CLOSE_SESION, GET_USER_LOGEG } from "./../types";

export function getUserAction(user) {
  return (dispatch) => {
    dispatch(getUser(user));
  };
}
const getUser = (user) => ({
  type: GET_USER_LOGEG,
  payload: user,
});
export function closeSesionAction() {
  return (dispatch) => {
    dispatch(closeSesion());
  };
}
const closeSesion = () => ({
  type: CLOSE_SESION,
});
