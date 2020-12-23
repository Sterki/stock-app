import { GET_PRODUCT_TO_EDIT } from "./../types";

export function productToEditAction(product) {
  return (dispatch) => {
    dispatch(getProductToEdit(product));
  };
}
const getProductToEdit = (product) => ({
  type: GET_PRODUCT_TO_EDIT,
  payload: product,
});
