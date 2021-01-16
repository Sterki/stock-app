import { useEffect, useState } from "react";
import db from "./../firebase";

export default function useGuiasDespachos() {
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState("");

  useEffect(() => {
    db.collection("customers").onSnapshot((result) => {
      setClientes(
        result.docs.map((doc) => ({ idcustomer: doc.id, infodata: doc.data() }))
      );
    });
  }, []);
  const handleChange = (e) => {
    const customer = JSON.parse(e.target.value);
    setCliente(customer);
    // console.log(cliente);
  };
  return {
    clientes,
    cliente,
    handleChange,
  };
}
