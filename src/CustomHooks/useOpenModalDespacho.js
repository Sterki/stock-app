import { useEffect, useState } from "react";
import { productToEditAction } from "../actions/productActions";
import db from "../firebase";

export default function useOpenModalDespacho() {
  const [valor, setValor] = useState({});
  const [openModalDespacho, setOpenModalDespacho] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [despachar, SetDespachar] = useState({
    cliente: "",
    cantidad: "",
  });
  const [productid, setProductid] = useState("");
  const [valoractual, setValoraDespachar] = useState();

  const handleClickOpenDespacho = (valores, idproducto) => {
    setValor(valores);
    setOpenModalDespacho(true);
    setProductid(idproducto);
  };
  const handleCloseModalDespacho = () => {
    setOpenModalDespacho(false);
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
  console.log(productid);
  const handleChangePrice = (e) => {
    SetDespachar({
      ...despachar,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitPrice = (e) => {
    e.preventDefault();
    console.log(despachar);
    console.log(valor);

    if (despachar.cantidad === "") {
      console.log("debe ingresar una cantidad");
    } else if (despachar.cantidad <= 0) {
      console.log("no a ingresado una cantidad valida!");
      return;
    } else if (despachar.cantidad > valor.amount) {
      console.log("No tiene suficientes productos para despachar esa cantidad");
      return;
    } else {
      let totalstock = valor.amount - despachar.cantidad;
      console.log(totalstock);
      db.collection("stock")
        .doc(productid)
        .update({
          amount: totalstock,
        })
        .then(function () {
          console.log("producto agregado a la guia de despacho correctamente");
        })
        .catch(function (error) {
          console.log("hubo un error");
        });
    }
  };
  return {
    customers,
    valor,
    openModalDespacho,
    handleClickOpenDespacho,
    handleCloseModalDespacho,
    handleChangePrice,
    handleSubmitPrice,
  };
}
