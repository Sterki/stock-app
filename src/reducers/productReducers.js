import {
  GET_PRODUCT_TO_EDIT,
  GET_LIST_PRODUCTS_TO_DELIVER,
  GET_CANTIDAD_DESPACHADA,
  GET_TOTAL_AMOUNT,
} from "./../types";

const inisialState = {
  producttoedit: {},
  categorys: [
    { id: 1, categoria: "VARIOS" },
    { id: 2, categoria: "FIERROS" },
    { id: 3, categoria: "ALBAÑILERIA-LOSA-MOLDAJE" },
    { id: 4, categoria: "TECHUMBRE-HOJALATERIA" },
    { id: 5, categoria: "CIELOS-TABIQUES-ALEROS" },
    { id: 6, categoria: "PUERTAS" },
    { id: 7, categoria: "PINTURAS-CERAMICA" },
    { id: 8, categoria: "ELECTRICOS" },
    { id: 9, categoria: "ARTEFACTOS BAÑO-ALCANTARILLADO" },
    { id: 10, categoria: "AGUA Y GAS" },
  ],
  productstodeliver: null,
  cantidaddespachada: null,
  totalamount: 0,
};

export default (state = inisialState, action) => {
  switch (action.type) {
    case GET_PRODUCT_TO_EDIT:
      return {
        ...state,
        producttoedit: action.payload,
      };
    case GET_LIST_PRODUCTS_TO_DELIVER:
      return {
        ...state,
        productstodeliver: action.payload,
      };
    case GET_CANTIDAD_DESPACHADA:
      return {
        ...state,
        cantidaddespachada: action.payload,
      };
    case GET_TOTAL_AMOUNT:
      return {
        ...state,
        totalamount: action.payload,
      };
    default:
      return state;
  }
};
