import { TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Stock.css";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import firebase from "firebase";

// table import
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

import db from "./../firebase";
import Product from "./Product";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 250,
    display: "flex",
    alignItems: "center",
  },
  formControlProveedor: {
    margin: theme.spacing(0),
    minWidth: "100%",
    display: "flex",
    alignItems: "center",
  },
  selectControl: {
    width: "100%",
  },
  selectControlProveedor: {
    width: "100%",
  },
}));

const columns = [
  { id: "proveedor", label: "Proveedor", minWidth: 170 },
  {
    id: "nombreproducto",
    label: "Nombre Producto",
    minWidth: 140,
  },
  {
    id: "category",
    label: "Categoría",
    minWidth: 150,
    align: "left",
  },
  {
    id: "price",
    label: "Precio Producto",
    minWidth: 150,
    align: "left",
  },
  {
    id: "cantidadtotal",
    label: "Total en Stock",
    minWidth: 100,
    align: "left",
  },
  {
    id: "estadostock",
    label: "Estado Stock ",
    minWidth: 170,
    align: "left",
  },

  {
    id: "delete",
    label: "#",
    minWidth: 50,
    align: "left",
  },
];

function Stock() {
  const classes = useStyles();
  const [state, setState] = useState({
    categoria: "",
  });
  const [supplier, setProveedor] = useState({});
  const [products, setProducts] = useState([]);

  const [restInfo, setRestInfo] = useState({
    nameproducto: "",
    cantidad: "",
    precio: "",
    minimo: "",
    maximo: "",
  });
  const [proveedores, setProveedores] = useState([]);
  const { nameproducto, cantidad, precio, minimo, maximo } = restInfo;
  const { categoria } = state;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  //useEffect para obtener los proveedores de nuestra base de datos firebase
  useEffect(() => {
    db.collection("suppliers")
      .orderBy("name", "asc")
      .onSnapshot((snapshot) => {
        setProveedores(
          snapshot.docs.map((doc) => ({
            idproveedor: doc.id,
            infodata: doc.data(),
          }))
        );
      });
  }, []);

  // useEffect para obtener el listado de productos de nuestra base de datos

  useEffect(() => {
    db.collection("stock")
      .orderBy("created", "desc")
      .onSnapshot((snapshot) => {
        setProducts(
          snapshot.docs.map((doc) => ({
            idproduct: doc.id,
            productinfo: doc.data(),
          }))
        );
      });
  }, []);
  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };
  const handleChangeProveedor = (e) => {
    let proveedorinfo = JSON.parse(e.target.value);
    setProveedor(proveedorinfo);
  };
  const handeChangeRestInfo = (e) => {
    const info = e.target.name;
    setRestInfo({
      ...restInfo,
      [info]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    db.collection("stock")
      .add({
        name: nameproducto.toUpperCase(),
        amount: cantidad,
        price: precio,
        stockmin: minimo,
        stockmax: maximo,
        category: categoria,
        supplier: supplier,
        created: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((result) => {
        console.log("producto ingresado correctamente!");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <div className="stock">
      <div className="stock__container">
        <div className="stock__title">
          <h3>Ingresar Productos</h3>
        </div>
        <div className="suppliers__error"></div>
        <div className="stock__inputscontainer">
          <form onSubmit={handleSubmit}>
            <div className="stock__inputs">
              <TextField
                id="outlined-basic"
                label="Nombre"
                variant="outlined"
                name="nameproducto"
                onChange={handeChangeRestInfo}
              />
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">
                  Categoria
                </InputLabel>
                <Select
                  className={classes.formControl}
                  native
                  value={state.categoria}
                  onChange={handleChange}
                  label="Categoria"
                  inputProps={{
                    name: "categoria",
                    id: "outlined-age-native-simple",
                  }}
                >
                  <option aria-label="None" value="" />
                  <option>Pétreos</option>
                  <option>Cerámicas y vidrios</option>
                  <option>Compuestos</option>
                  <option>Metálicos</option>
                  <option>Aglutinantes</option>
                </Select>
              </FormControl>
            </div>
            <div className="stock__inputs2">
              <TextField
                id="outlined-basic"
                type="number"
                label="Cantidad"
                variant="outlined"
                name="cantidad"
                onChange={handeChangeRestInfo}
              />
              <TextField
                id="outlined-basic"
                type="number"
                label="Precio"
                variant="outlined"
                name="precio"
                onChange={handeChangeRestInfo}
              />
            </div>
            <div className="stock__inputs3">
              <TextField
                id="outlined-basic"
                label="Stock Minimo"
                variant="outlined"
                type="number"
                name="minimo"
                onChange={handeChangeRestInfo}
              />
              <TextField
                id="outlined-basic"
                label="Stock Máximo"
                variant="outlined"
                type="number"
                name="maximo"
                onChange={handeChangeRestInfo}
              />
            </div>
            <div className="stock__inputs4">
              <FormControl
                variant="outlined"
                className={classes.formControlProveedor}
              >
                <InputLabel htmlFor="outlined-age-native-simple">
                  Proveedor
                </InputLabel>
                <Select
                  className={classes.selectControlProveedor}
                  native
                  value={supplier.proveedor}
                  onChange={handleChangeProveedor}
                  label="Proveedor"
                  inputProps={{
                    name: "proveedor",
                    id: "outlined-age-native-simple",
                  }}
                >
                  <option aria-label="None" value="" />
                  {proveedores.map(({ idproveedor, infodata }) => (
                    <option
                      key={idproveedor}
                      value={JSON.stringify({
                        id: idproveedor,
                        nameproveedor: infodata.name,
                      })}
                    >
                      {infodata.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                name="email"
              /> */}
            </div>
            <div className="stock__button">
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
                {products
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(({ idproduct, productinfo }) => {
                    return (
                      <Product
                        key={idproduct}
                        id={idproduct}
                        infodata={productinfo}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 50]}
            component="div"
            count={products.length}
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

export default Stock;
