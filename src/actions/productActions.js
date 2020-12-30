import { GET_PRODUCT_TO_EDIT, GET_LIST_PRODUCTS_TO_DELIVER } from "./../types";

export function productToEditAction(product) {
  return (dispatch) => {
    dispatch(getProductToEdit(product));
  };
}
const getProductToEdit = (product) => ({
  type: GET_PRODUCT_TO_EDIT,
  payload: product,
});

export function getProductsToDeliver(products) {
  return (dispatch) => {
    dispatch(getProductsTo(products));
  };
}
const getProductsTo = (products) => ({
  type: GET_LIST_PRODUCTS_TO_DELIVER,
  payload: products,
});
