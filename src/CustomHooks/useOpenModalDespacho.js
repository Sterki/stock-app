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

  const userAuth = useSelector((state) => state.users.user);
  const totalamount = useSelector((state) => state.products.totalamount);
  const [alerta, setAlerta] = useState("");

  const [numeroguia, setNumeroguia] = useState(""); // esto debe ser automatico o ingresado por el cliente corresponde al codigo de la guia
  const [selectcliente, setSelectCliente] = useState("");

  const handleClickOpenDespacho = (valores, idproducto) => {
    setValor(valores);
    setOpenModalDespacho(true);
    setProductid(idproducto);
    db.collection("stock")
      .doc(idproducto)
      .onSnapshot((result) => setValoragreado(result.data())); // guardar informacion del producto completa para poder llenar la guia de despacho y para el automatico del modal
    if (idproducto) {
      db.collection("stock")
        .doc(idproducto)
        .onSnapshot((result) => {
          dispatch(getProductTotalAmountAction(result.data()));
        });
    }
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
    if (e.target.value === "") {
      setSelectCliente(e.target.value);
      return;
    } else {
      let customerinfo = JSON.parse(e.target.value);
      setSelectCliente(customerinfo);
      SetDespachar(customerinfo);
      dispatch(getCustomerAddProductAction(customerinfo));
      if (customerinfo) {
        db.collection("customers")
          .doc(customerinfo?.id)
          .collection("despachos")
          .doc(numeroguia?.numeroguia)
          .collection("productosadespachar")
          .doc(productid)
          .onSnapshot((result) => {
            dispatch(getCantidadDespachadaAction(result.data()));
          });
      }
    }
  };
  const handleClickGetdespachoDetalles = (e) => {
    e.preventDefault();

    history.push("/guiadespacho");

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

    if (!numeroguia) {
      setAlerta("No ha ingresado el numero de guia!");
      setTimeout(() => {
        setAlerta("");
      }, 3000);
      return;
    }
    if (cantidadIngresada > valor.amount) {
      setAlerta("La cantidad ingresada es mayor al stock actual");
      setTimeout(() => {
        setAlerta("");
      }, 3000);
      return;
    }
    if (selectcliente === "") {
      setAlerta("No ha seleccionado un cliente!");
      setTimeout(() => {
        setAlerta("");
      }, 3000);
      return;
    }
    if (cantidadIngresada >= valor.amount) {
      setAlerta("Ojo Estas agregando la cantidad exacta de tu stock actual");
      setTimeout(() => {
        setAlerta("");
      }, 3000);
      return;
    }
    if (cantidadIngresada === "") {
      setAlerta("Debe ingresar una cantidad");
      setTimeout(() => {
        setAlerta("");
      }, 3000);
    } else if (cantidadIngresada <= 0) {
      setAlerta("No a ingresado una cantidad valida!");
      setTimeout(() => {
        setAlerta("");
      }, 3000);
      return;
    } else if (cantidadIngresada > valor.amount) {
      setAlerta("No tiene suficientes productos para despachar esa cantidad");
      setTimeout(() => {
        setAlerta("");
      }, 3000);
      return;
    } else {
      let totalstock = 0;
      let newamount = 0;
      if (cantidadantigua) {
        newamount = Number(
          cantidadantigua?.cantidadadespachar + cantidadIngresada
        );
        let actualAmount = Number(valor.amount);

        totalstock = Number(totalamount.amount - cantidadIngresada);
      } else {
        newamount = cantidadIngresada;
        totalstock = Number(totalamount.amount - cantidadIngresada);
      }
      db.collection("stock")
        .doc(productid)
        .update({
          amount: totalstock,
        })
        .then(function () {
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
    numeroguia,
    alerta,
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
