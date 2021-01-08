import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import db from "../firebase";
import firebase from "firebase";
import {
  getCantidadDespachadaAction,
  setNullCantidadDespachadaAction,
} from "../actions/productActions";

export default function useOpenModalGuia() {
  const [openAddproduct, setOpenAddproduct] = useState(false);
  const [listadoProductos, setListadoProductos] = useState([]);
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();
  const [producto, setProducto] = useState({});
  const customerinfo = useSelector((state) => state.customers.customerinfo);
  const [cantidaddespachada, setCantidadDespachadaAnterior] = useState({});

  const userAuth = useSelector((state) => state.users.user);
  const cantidadantigua = useSelector(
    (state) => state.products.cantidaddespachada
  );

  const handleOpenModalGuia = () => {
    setOpenAddproduct(true);
    dispatch(setNullCantidadDespachadaAction());
  };
  const handleCloseModalGuia = () => {
    setOpenAddproduct(false);
  };

  useEffect(() => {
    db.collection("stock").onSnapshot((snapshot) => {
      setListadoProductos(
        snapshot.docs.map((doc) => ({
          idproducto: doc.id,
          infodata: doc.data(),
        }))
      );
    });
  }, []);

  const handleChange = (e) => {
    let valores = JSON.parse(e.target.value);

    setProducto(valores);
    if (valores) {
      console.log(valores);
      console.log(customerinfo);
      db.collection("customers")
        .doc(customerinfo.customerinfo.id)
        .collection("despachos")
        .doc(customerinfo.idnumeroguia)
        .collection("productosadespachar")
        .doc(valores.id)
        .onSnapshot((result) => {
          console.log("hola: ", result.data());
          console.log(valores.id);
          dispatch(getCantidadDespachadaAction(result.data()));
        });
    }
  };
  const handleClickEliminar = (productid, productinfo) => {
    db.collection("customers")
      .doc(customerinfo.customerinfo.id)
      .collection("despachos")
      .doc(customerinfo.idnumeroguia)
      .collection("productosadespachar")
      .doc(productid)
      .onSnapshot((result) =>
        dispatch(getCantidadDespachadaAction(result.data()))
      );
    db.collection("stock")
      .doc(productid)
      .update({
        amount: cantidadantigua.producto.amount,
      })
      .then(function () {
        console.log("actualizado correctamente!");
      })
      .catch(function (error) {
        console.log(error.message);
      });

    // setTimeout(() => {
    //   db.collection("customers")
    //     .doc(customerinfo.customerinfo.id)
    //     .collection("despachos")
    //     .doc(customerinfo.idnumeroguia)
    //     .collection("productosadespachar")
    //     .doc(productid)
    //     .delete()
    //     .then(function () {
    //       console.log("producto Eliminado correctamente");
    //       // reparar esto
    //     });
    // }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("desde el formulario");
    // console.log(customerinfo.customerinfo.id);
    // console.log(customerinfo.idnumeroguia);

    // console.log(
    //   "cantidad: ",
    //   amount,
    //   "producto:",
    //   producto,
    //   "customer: ",
    //   customerinfo
    // );

    // console.log(amount);
    // console.log(producto.infodata.amount);
    let newamount = 0;
    if (cantidadantigua) {
      newamount = cantidadantigua?.cantidadadespachar + amount;
    } else {
      newamount = amount;
    }

    // console.log("new amount: ", newamount);
    let totalstock = producto.infodata.amount - amount;
    db.collection("customers")
      .doc(customerinfo.customerinfo.id)
      .collection("despachos")
      .doc(customerinfo.idnumeroguia)
      .collection("productosadespachar")
      .doc(producto.id)
      .set({
        producto: producto.infodata,
        cantidadadespachar: newamount,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        creator: userAuth.email,
      })
      .then(function () {
        console.log("producto agregado a despacho correctamente");
        db.collection("stock").doc(producto.id).update({
          amount: totalstock,
        });
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  return {
    openAddproduct,
    amount,
    listadoProductos,
    handleOpenModalGuia,
    handleClickEliminar,
    handleSubmit,
    setAmount,
    handleChange,
    handleCloseModalGuia,
  };
}
