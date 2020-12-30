import { useEffect, useState } from "react";
import {
  getProductsToDeliver,
  productToEditAction,
} from "../actions/productActions";
import db from "../firebase";
import firebase from "firebase";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getCustomerInfoAction } from "../actions/customerActions";

export default function useOpenModalDespacho() {
  const [valor, setValor] = useState({}); // producto a despachar, corresponde a los valores completo del producto
  const [openModalDespacho, setOpenModalDespacho] = useState(false); // abre el modal
  const [customers, setCustomers] = useState([]); // listado de customers
  const [despachar, SetDespachar] = useState({}); // corresponde al cliente que se le despacha el producto
  const [cantidadIngresada, setCantiadingresada] = useState(0); // corresponde a la cantidad a ser despachada
  const [productid, setProductid] = useState(""); // id del producto a despachar
  const [enviado, setEnviado] = useState(false);
  const [valoragregado, setValoragreado] = useState();
  const dispatch = useDispatch();
  const history = useHistory();

  const userAuth = useSelector((state) => state.users.user);

  const [numeroguia, setNumeroguia] = useState(""); // esto debe ser automatico o ingresado por el cliente corresponde al codigo de la guia

  const handleClickOpenDespacho = (valores, idproducto) => {
    setValor(valores);
    setOpenModalDespacho(true);
    setProductid(idproducto);
    db.collection("stock")
      .doc(idproducto)
      .onSnapshot((result) => setValoragreado(result.data())); // guardar informacion del producto completa para poder llenar la guia de despacho y para el automatico del modal
  };
  const handleCloseModalDespacho = () => {
    setOpenModalDespacho(false);
    setEnviado(false);
  };
  useEffect(() => {
    db.collection("customers").onSnapshot((snapshot) => {
      setCustomers(
        snapshot.docs.map((doc) => ({
          idcustomer: doc.id,
          customerinfo: doc.data(),
        }))
      );
    });
  }, []);
  if (productid === null) return null;

  const handleChangeNumeroGuia = (e) => {
    setNumeroguia({
      ...numeroguia,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePrice = (e) => {
    let customerinfo = JSON.parse(e.target.value);
    SetDespachar(customerinfo);
    console.log(despachar);
  };

  const handleClickGetdespachoDetalles = (e) => {
    e.preventDefault();
    console.log("desde getDespacho details");
    console.log(numeroguia.numeroguia);
    history.push("/guiadespacho");
    console.log(despachar.id);
    console.log(despachar);
    if (numeroguia.numeroguia !== "" && despachar.id !== "") {
      db.collection("customers")
        .doc(despachar.id)
        .collection("despachos")
        .doc(numeroguia.numeroguia)
        .collection("productosadespachar")
        .onSnapshot((snapshot) => {
          dispatch(
            getProductsToDeliver(snapshot.docs.map((doc) => doc.data()))
          );
          dispatch(getCustomerInfoAction(despachar, numeroguia.numeroguia));
        });
    }
  };

  const handleSubmitPrice = (e) => {
    e.preventDefault();

    // console.log(valor);
    if (numeroguia) {
      console.log(numeroguia.numeroguia);
    }
    if (cantidadIngresada > valor.amount) {
      console.log(true);
      console.log("la cantidad ingresada es mayor al stock actual");
      return;
    }
    if (cantidadIngresada >= valor.amount) {
      console.log("Ojo Estas agregando la cantidad exacta de tu stock actual");
      return;
    }
    if (cantidadIngresada === "") {
      console.log("debe ingresar una cantidad");
    } else if (cantidadIngresada <= 0) {
      console.log("no a ingresado una cantidad valida!");
      return;
    } else if (cantidadIngresada > valor.amount) {
      console.log("No tiene suficientes productos para despachar esa cantidad");
      return;
    } else {
      let totalstock = valor.amount - cantidadIngresada;

      db.collection("stock")
        .doc(productid)
        .update({
          amount: totalstock,
        })
        .then(function () {
          console.log("producto agregado a la guia de despacho correctamente");
          console.log("despachar a :", despachar.id);
          db.collection("customers")
            .doc(despachar.id)
            .collection("despachos")
            .doc(numeroguia.numeroguia)
            .collection("productosadespachar")
            .doc(productid)
            .set({
              producto: valor,
              cantidadadespachar: cantidadIngresada,
              created: firebase.firestore.FieldValue.serverTimestamp(),
              creator: userAuth.email,
            })
            .then(function () {
              console.log("producto cargado correctamente a la guia");
            })
            .catch(function (error) {
              console.log(error.message);
            });
          setEnviado(true);
        })
        .catch(function (error) {
          console.log(error.message);
        });
      setCantiadingresada(0);
    }
  };
  return {
    customers,
    valoragregado,
    valor,
    enviado,

    setEnviado,
    openModalDespacho,
    cantidadIngresada,
    handleClickOpenDespacho,
    handleCloseModalDespacho,
    handleChangePrice,
    handleSubmitPrice,
    setCantiadingresada,
    handleChangeNumeroGuia,
    handleClickGetdespachoDetalles,
  };
}
