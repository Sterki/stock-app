import {
  GET_PRODUCT_TO_EDIT,
  GET_LIST_PRODUCTS_TO_DELIVER,
  GET_CANTIDAD_DESPACHADA,
  GET_TOTAL_AMOUNT,
  SET_NULL_CANTIDAD_DESP,
} from "./../types";

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

export function getCantidadDespachadaAction(cantidad) {
  return (dispatch) => {
    dispatch(getCantidadDespachada(cantidad));
  };
}
const getCantidadDespachada = (cantidad) => ({
  type: GET_CANTIDAD_DESPACHADA,
  payload: cantidad,
});

export function getProductTotalAmountAction(cantidadtotal) {
  return (dispatch) => {
    dispatch(getProductTotalAmount(cantidadtotal));
  };
}
const getProductTotalAmount = (cantidadtotal) => ({
  type: GET_TOTAL_AMOUNT,
  payload: cantidadtotal,
});

export function setNullCantidadDespachadaAction() {
  return (dispatch) => {
    dispatch(setNullCantidadDespachada());
  };
}
const setNullCantidadDespachada = () => ({
  type: SET_NULL_CANTIDAD_DESP,
});
