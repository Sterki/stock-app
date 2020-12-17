import { TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Stock.css";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import db from "./../firebase";

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

function Stock() {
  const classes = useStyles();
  const [state, setState] = useState({
    categoria: "",
  });
  const [proveedor, setProveedor] = useState({
    proveedor: "",
  });
  const [proveedores, setProveedores] = useState([]);

  //useEffect para obtener los proveedores de nuestra base de datos firebase
  useEffect(() => {
    db.collection("suppliers").onSnapshot((snapshot) => {
      setProveedores(
        snapshot.docs.map((doc) => ({ id: doc.id, infodata: doc.data() }))
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
    const name = e.target.name;
    setProveedor({
      [name]: e.target.value,
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
          <form>
            <div className="stock__inputs">
              <TextField
                id="outlined-basic"
                label="Nombre"
                variant="outlined"
                name="name"
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
              />
              <TextField
                id="outlined-basic"
                type="number"
                label="Precio"
                variant="outlined"
                name="precio"
              />
            </div>
            <div className="stock__inputs3">
              <TextField
                id="outlined-basic"
                label="Stock Minimo"
                variant="outlined"
                name="minimo"
              />
              <TextField
                id="outlined-basic"
                label="Stock Máximo"
                variant="outlined"
                name="maximo"
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
                  value={proveedor.proveedor}
                  onChange={handleChangeProveedor}
                  label="Proveedor"
                  inputProps={{
                    name: "proveedor",
                    id: "outlined-age-native-simple",
                  }}
                >
                  <option aria-label="None" value="" />
                  {proveedores.map((prove) => (
                    <option key={prove.id} value={prove.infodata.name}>
                      {prove.infodata.name}
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
    </div>
  );
}

export default Stock;
