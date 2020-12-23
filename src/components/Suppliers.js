import React, { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import "./Suppliers.css";
import db from "./../firebase";
import firebase from "firebase";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import Supplier from "./Supplier";

//here fancy package to dev a grid table
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
  { id: "rut", label: "Rut", minWidth: 170 },
  { id: "nombreproveedor", label: "Nombre Proveedor", minWidth: 100 },
  {
    id: "direccion",
    label: "Dirección",
    minWidth: 170,
    align: "left",
  },
  {
    id: "city",
    label: "Ciudad",
    minWidth: 130,
    align: "left",
  },
  {
    id: "creador",
    label: "Ingresado Por",
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

function Suppliers() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [agregarClientes, setAgregarClientes] = useState(
    "Agregar Proveedores +"
  );
  const [error, setError] = useState("");
  const userAuth = useSelector((state) => state.users.user);
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState({
    namesupplier: "",
    rutsupplier: "",
    address: "",
    city: "",
    province: "",
  });
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
    let isRendered = true;
    if (isRendered) {
      db.collection("suppliers")
        .orderBy("created", "desc")
        .onSnapshot((snapshot) => {
          setSuppliers(
            snapshot.docs.map((doc) => ({
              idInfo: doc.id,
              suppInfo: doc.data(),
            }))
          );
        });
    }
    return () => {
      isRendered = false;
    };
  }, []);

  const { namesupplier, rutsupplier, address, city, province } = supplier;

  const handleChange = (e) => {
    setSupplier({
      ...supplier,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      namesupplier.trim() === "" ||
      rutsupplier.trim() === "" ||
      city.trim() === "" ||
      address.trim() === "" ||
      province.trim() === ""
    ) {
      setError("Todos los campos son obligatorios");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else {
      db.collection("suppliers")
        .add({
          name: namesupplier.toUpperCase(),
          rut: rutsupplier,
          address: address.toUpperCase(),
          city: city.toUpperCase(),
          province: province.toUpperCase(),
          creator: userAuth.email,
          created: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .catch((error) => {
          setError(error.message);
        });
      setOpen(true);
      setSupplier({
        namesupplier: "",
        rutsupplier: "",
        address: "",
        city: "",
        province: "",
      });
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  function showAndHideDiv() {
    let div = document.getElementById("myDiv");
    // let boton = document.getElementById("botonagregar");

    if (div.style.display === "flex") {
      div.style.display = "none";
      // boton.classList.add("buttonagregarmas");
      setAgregarClientes("Agregar Proveedores +");
      // boton.classList.remove("buttonagregarmenos");
    } else {
      div.style.display = "flex";
      // boton.classList.add("buttonagregarmenos");
      setAgregarClientes("Ocultar Agregar Proveedores -");
      // boton.classList.remove("buttonagregarmas");
    }
  }
  return (
    <div className="suppliers">
      <div className="suppliers__buttonagregar">
        <button onClick={showAndHideDiv} id="botonagregar">
          {agregarClientes}
        </button>
      </div>
      <div className="suppliers__container" id="myDiv">
        <div className="suppliers__title">
          <h3>Ingresar Proveedores</h3>
          <div className="suppliers__error">
            {error && <Alert severity="error">{error}</Alert>}
          </div>
        </div>
        <div className="supplier__inputscontainer">
          <form onSubmit={handleSubmit}>
            <div className="suppliers__inputs">
              <TextField
                id="outlined-basic"
                label="Nombre"
                variant="outlined"
                name="namesupplier"
                value={namesupplier}
                onChange={handleChange}
              />
              <TextField
                id="outlined-basic"
                label="Rut"
                variant="outlined"
                name="rutsupplier"
                value={rutsupplier}
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
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                Proveedor guardado con éxito
              </Alert>
            </Snackbar>
            <div className="suppliers__button">
              <button type="submit">Guardar</button>
            </div>
          </form>
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
                {suppliers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <Supplier
                        key={row.idInfo}
                        idsupplier={row.idInfo}
                        infodata={row.suppInfo}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 50]}
            component="div"
            count={suppliers.length}
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

export default Suppliers;
