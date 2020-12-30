import { GET_CUSTOMER_TO_EDIT, GET_CUSTOMER_INFO } from "./../types";

export function getCustomerToEditAction(customer) {
  return (dispatch) => {
    dispatch(getCustomerToEdit(customer));
  };
}
const getCustomerToEdit = (customer) => ({
  type: GET_CUSTOMER_TO_EDIT,
  payload: customer,
});
export function getCustomerInfoAction(customer, id) {
  console.log(id);
  return (dispatch) => {
    dispatch(getCustomerInfo(customer, id));
  };
}
const getCustomerInfo = (customer, id) => ({
  type: GET_CUSTOMER_INFO,
  payload: { customerinfo: customer, idnumeroguia: id },
});
