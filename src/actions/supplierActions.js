import { GET_SUPPLIER_TO_EDIT } from "./../types";

export function getSupplierToEditAction(infodata) {
  return (dispatch) => {
    dispatch(getSupplierToEdit(infodata));
  };
}
const getSupplierToEdit = (infodata) => ({
  type: GET_SUPPLIER_TO_EDIT,
  payload: infodata,
});
