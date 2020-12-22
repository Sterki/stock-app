import { GET_CUSTOMER_TO_EDIT } from "./../types";

export function getCustomerToEditAction(customer) {
  return (dispatch) => {
    dispatch(getCustomerToEdit(customer));
  };
}
const getCustomerToEdit = (customer) => ({
  type: GET_CUSTOMER_TO_EDIT,
  payload: customer,
});
