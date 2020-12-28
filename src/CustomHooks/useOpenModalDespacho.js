import { useEffect, useState } from "react";
import { productToEditAction } from "../actions/productActions";
import db from "../firebase";

export default function useOpenModalDespacho() {
  const [valor, setValor] = useState({}); // producto a despachar, corresponde a los valores completo del producto
  const [openModalDespacho, setOpenModalDespacho] = useState(false); // abre el modal
  const [customers, setCustomers] = useState([]); // listado de customers
  const [despachar, SetDespachar] = useState({}); // corresponde al cliente que se le despacha el producto
  const [cantidadIngresada, setCantiadingresada] = useState(0); // corresponde a la cantidad a ser despachada
  const [productid, setProductid] = useState(""); // id del producto a despachar
  const [enviado, setEnviado] = useState(false);

  const handleClickOpenDespacho = (valores, idproducto) => {
    setValor(valores);
    setOpenModalDespacho(true);
    setProductid(idproducto);
    db.collection("stock")
      .doc(idproducto)
      .onSnapshot((result) => console.log(result.data())); // guardar informacion del producto completa para poder llenar la guia de despacho y para el automatico del modal
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

  const handleChangePrice = (e) => {
    let customerinfo = JSON.parse(e.target.value);
    SetDespachar(customerinfo);
  };

  const handleSubmitPrice = (e) => {
    e.preventDefault();
    console.log(despachar);
    // console.log(valor);

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
          setEnviado(true);
        })
        .catch(function (error) {
          console.log("hubo un error");
        });
      setCantiadingresada(0);
    }
  };
  return {
    customers,
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
  };
}
