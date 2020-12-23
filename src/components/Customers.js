import { makeStyles, Snackbar, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Customers.css";
import "./Suppliers.css";
import db from "./../firebase";
import MuiAlert from "@material-ui/lab/Alert";
import firebase from "firebase";
import { useSelector } from "react-redux";
import Customer from "./Customer";

//imports para las tablas
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const columns = [
  { id: "rut", label: "Rut", minWidth: 100 },
  {
    id: "nombreproveedor",
    label: "Nombre Cliente",
    minWidth: 120,
  },
  {
    id: "direccion",
    label: "Dirección",
    minWidth: 170,
    align: "left",
  },
  {
    id: "city",
    label: "Ciudad",
    minWidth: 150,
    align: "left",
  },
  {
    id: "email",
    label: "Email",
    minWidth: 170,
    align: "left",
  },
  {
    id: "phone",
    label: "Teléfono",
    minWidth: 100,
    align: "left",
  },
  {
    id: "delete",
    label: "#",
    minWidth: 100,
    align: "left",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    container: {
      maxHeight: 440,
    },
  },
}));
function Customers() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [agregarClientes, setAgregarClientes] = useState("Agregar Clientes +");
  const userAuth = useSelector((state) => state.users.user);
  const [customers, setCustomers] = useState([]);
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

  //useEffect para obtener los datos de los clientes
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    let isRendering = true;
    if (isRendering) {
      db.collection("customers")
        .orderBy("created", "desc")
        .onSnapshot((snapshot) => {
          setCustomers(
            snapshot.docs.map((doc) => ({ id: doc.id, datainfo: doc.data() }))
          );
        });
    }
    return () => {
      isRendering = false;
    };
  }, []);

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
  function showAndHideDiv() {
    let div = document.getElementById("myDiv");
    // let boton = document.getElementById("botonagregar");

    if (div.style.display === "flex") {
      div.style.display = "none";
      // boton.classList.add("buttonagregarmas");
      setAgregarClientes("Agregar Clientes +");
      // boton.classList.remove("buttonagregarmenos");
    } else {
      div.style.display = "flex";
      // boton.classList.add("buttonagregarmenos");
      setAgregarClientes("Ocultar Agregar Clientes -");
      // boton.classList.remove("buttonagregarmas");
    }
  }
  return (
    <div className="customers">
      <div className="suppliers__buttonagregar">
        <button onClick={showAndHideDiv} id="botonagregar">
          {agregarClientes}
        </button>
      </div>
      <div className="suppliers__container" id="myDiv">
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
                label="Teléfono (opcional)"
                variant="outlined"
                name="phone"
                value={phone}
                onChange={handleChange}
              />
              <TextField
                id="outlined-basic"
                label="Celular (opcional)"
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
      <div className="suppliers2">
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {customers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <Customer
                        key={row.id}
                        id={row.id}
                        infodata={row.datainfo}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 50]}
            component="div"
            count={customers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
            backIconButtonText="Pagina anterior"
            nextIconButtonText="Siguiente pagina"
          />
        </Paper>
      </div>
    </div>
  );
}

export default Customers;
