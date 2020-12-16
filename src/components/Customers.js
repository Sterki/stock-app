import { Snackbar, TextField } from "@material-ui/core";
import React, { useState } from "react";
import "./Customers.css";
import "./Suppliers.css";
import db from "./../firebase";
import MuiAlert from "@material-ui/lab/Alert";
import { SettingsPowerRounded } from "@material-ui/icons";
import firebase from "firebase";
import { useSelector } from "react-redux";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function Customers() {
  const [open, setOpen] = useState(false);
  const userAuth = useSelector((state) => state.users.user);
  const [customer, setCustomer] = useState({
    namecustomer: "",
    rutcustomer: "",
    address: "",
    city: "",
    province: "",
    phone: "",
    movil: "",
    email: "",
  });
  const [error, setError] = useState("");

  const {
    namecustomer,
    rutcustomer,
    address,
    city,
    province,
    phone,
    movil,
    email,
  } = customer;

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (namecustomer.trim() === "") {
      setError("El nombre del cliente es obligatorio");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else if (rutcustomer.trim() === "") {
      setError("el rut del cliente es obligatorio");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else if (address.trim() === "") {
      setError("La dirección es obligatoria");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else if (email.trim() === "") {
      setError("El email es obligatorio");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else if (city.trim() === "") {
      setError("La ciudad es obligatoria");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else {
      db.collection("customers")
        .add({
          namecustomer: namecustomer.toUpperCase(),
          rutcustomer: rutcustomer,
          address: address.toUpperCase(),
          city: city.toUpperCase(),
          province: province.toUpperCase(),
          phone: phone,
          movil: movil,
          email: email.toUpperCase(),
          created: firebase.firestore.FieldValue.serverTimestamp(),
          creator: userAuth.email,
        })
        .then((result) => {
          setOpen(true);
          console.log("cliente agregado correctamente!");
          setCustomer({
            namecustomer: "",
            rutcustomer: "",
            address: "",
            city: "",
            province: "",
            phone: "",
            movil: "",
            email: "",
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };
  return (
    <div className="customers">
      <div className="suppliers__container">
        <div className="suppliers__title">
          <h3>Ingresar CLientes</h3>
        </div>
        <div className="suppliers__error">
          {error && <Alert severity="error">{error}</Alert>}
        </div>
        <div className="supplier__inputscontainer">
          <form onSubmit={handleSubmit}>
            <div className="suppliers__inputs">
              <TextField
                id="outlined-basic"
                label="Nombre"
                variant="outlined"
                name="namecustomer"
                value={namecustomer}
                onChange={handleChange}
              />
              <TextField
                id="outlined-basic"
                label="Rut"
                variant="outlined"
                name="rutcustomer"
                value={rutcustomer}
                onChange={handleChange}
              />
            </div>
            <div className="suppliers__inputs2">
              <TextField
                id="outlined-basic"
                label="Dirección"
                variant="outlined"
                name="address"
                value={address}
                onChange={handleChange}
              />
            </div>
            <div className="suppliers__inputs3">
              <TextField
                id="outlined-basic"
                label="Ciudad"
                variant="outlined"
                name="city"
                value={city}
                onChange={handleChange}
              />
              <TextField
                id="outlined-basic"
                label="Comuna / Provincia / Region"
                variant="outlined"
                name="province"
                value={province}
                onChange={handleChange}
              />
            </div>
            <div className="suppliers__input4">
              <TextField
                id="outlined-basic"
                label="Teléfono"
                variant="outlined"
                name="phone"
                value={phone}
                onChange={handleChange}
              />
              <TextField
                id="outlined-basic"
                label="Celular"
                variant="outlined"
                name="movil"
                value={movil}
                onChange={handleChange}
              />
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </div>
            <div className="suppliers__button">
              <button type="submit">Guardar</button>
            </div>
          </form>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              Cliente guardado con éxito
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
}

export default Customers;
