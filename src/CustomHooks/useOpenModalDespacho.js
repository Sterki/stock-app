import { useEffect, useState } from "react";
import {
  getCantidadDespachadaAction,
  getProductsToDeliver,
  getProductTotalAmountAction,
  productToEditAction,
} from "../actions/productActions";
import db from "../firebase";
import firebase from "firebase";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getCustomerAddProductAction,
  getCustomerInfoAction,
} from "../actions/customerActions";

export default function useOpenModalDespacho() {
  const [valor, setValor] = useState({}); // producto a despachar, corresponde a los valores completo del producto
  const [openModalDespacho, setOpenModalDespacho] = useState(false); // abre el modal
  const [customers, setCustomers] = useState([]); // listado de customers
  const [despachar, SetDespachar] = useState({}); // corresponde al cliente que se le despacha el producto
  const [cantidadIngresada, setCantiadingresada] = useState(0); // corresponde a la cantidad a ser despachada
  const [productid, setProductid] = useState(""); // id del producto a despachar
  const [enviado, setEnviado] = useState(false);
  const [valoragregado, setValoragreado] = useState();
  const customerinfo = useSelector((state) => state.customers.customerinfoadd);
  const dispatch = useDispatch();
  const history = useHistory();
  // state para controlar el envio del formulario
  const [enviadoguia, setEnviadoGuia] = useState("");
  const cantidadantigua = useSelector(
    (state) => state.products.cantidaddespachada
  );
  console.log(cantidadantigua?.cantidadadespachar);
  const userAuth = useSelector((state) => state.users.user);
  const totalamount = useSelector((state) => state.products.totalamount);
  console.log(totalamount.amount);
  const [numeroguia, setNumeroguia] = useState(""); // esto debe ser automatico o ingresado por el cliente corresponde al codigo de la guia

  useEffect(() => {
    if (productid) {
      db.collection("stock")
        .doc(productid)
        .onSnapshot((result) => {
          dispatch(getProductTotalAmountAction(result.data()));
        });
    }
  }, [productid]);
  const handleClickOpenDespacho = (valores, idproducto) => {
    console.log(despachar);
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
    dispatch(getCustomerAddProductAction(customerinfo));
    console.log(despachar.customerinfo);
    console.log(numeroguia.numeroguia);
    if (customerinfo) {
      db.collection("customers")
        .doc(customerinfo?.id)
        .collection("despachos")
        .doc(numeroguia?.numeroguia)
        .collection("productosadespachar")
        .doc(productid)
        .onSnapshot((result) => {
          console.log(result.data());
          console.log(productid);
          dispatch(getCantidadDespachadaAction(result.data()));
        });
    }
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
            getProductsToDeliver(
              snapshot.docs.map((doc) => ({
                productid: doc.id,
                dataproduct: doc.data(),
              }))
            )
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
      let totalstock = 0;
      let newamount = 0;
      if (cantidadantigua) {
        console.log("cantidad antigua: ", cantidadantigua.cantidadadespachar);
        console.log("cantidadIngresada", cantidadIngresada);
        newamount = Number(
          cantidadantigua?.cantidadadespachar + cantidadIngresada
        );
        let actualAmount = Number(valor.amount);
        console.log("monto actual", actualAmount);
        totalstock = Number(totalamount.amount - cantidadIngresada);
        console.log("total stock en el if", totalstock);
      } else {
        newamount = cantidadIngresada;
        totalstock = Number(totalamount.amount - cantidadIngresada);
        console.log("total stock else", totalstock);
      }
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
              cantidadadespachar: newamount,
              created: firebase.firestore.FieldValue.serverTimestamp(),
              creator: userAuth.email,
            })
            .then(function () {
              console.log("producto cargado correctamente a la guia");
              setEnviadoGuia("Producto enviado a la guia Correctamente");
              setTimeout(() => {
                setEnviadoGuia("");
              }, 3000);
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
    enviadoguia,
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
