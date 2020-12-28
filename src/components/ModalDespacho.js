import React, { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl, InputLabel, Select, TextField } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import db from "./../firebase";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "0px solid lightgray",
    borderRadius: "5px",
    WebkitBoxShadow: "1px 1px 0px 10px inset var(--azul)",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 5, 3),
    outline: "none",
  },
}));
// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

function ModalDespacho({
  idproduct,
  customers,
  enviado,
  openModalDespacho,
  cantidadIngresada,
  handleCloseModalDespacho,
  handleChangePrice,
  valor,
  handleSubmitPrice,
  setCantiadingresada,
}) {
  const classes = useStyles();

  let total = valor.amount - cantidadIngresada;

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModalDespacho}
        onClose={handleCloseModalDespacho}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModalDespacho}>
          <div className={classes.paper}>
            <div className="suppliers__titlemodal">
              <h3>Generar Guia de despacho</h3>
            </div>
            <div className="suppliers__error">
              {/* {error && <Alert severity="error">{error}</Alert>} */}
            </div>
            <form onSubmit={handleSubmitPrice}>
              <div className="product__codeproduct">
                <div className="product__nameproducto">
                  <span>
                    Nombre Producto: <strong>{valor.name}</strong>
                  </span>
                </div>
                <div className="produdct__restvalue">
                  <span>
                    Código del producto: <strong>{valor.productcode}</strong>
                  </span>
                  <span>
                    Stock Actual:{" "}
                    <strong>{cantidadIngresada ? total : valor.amount}</strong>
                  </span>
                  <span>
                    Precion Unitario: <strong>$ {valor.price}</strong>
                  </span>
                </div>
              </div>

              <div className="suppliers__inputs">
                <FormControl
                  variant="outlined"
                  style={{
                    width: "100%",
                    marginBottom: "1rem",
                    marginRight: "1rem",
                  }}
                >
                  <InputLabel htmlFor="outlined-age-native-simple">
                    Cliente
                  </InputLabel>
                  <Select
                    className={classes.formControl}
                    native
                    // value={category}
                    onChange={handleChangePrice}
                    label="Categoria"
                    inputProps={{
                      name: "cliente",
                      id: "outlined-age-native-simple",
                    }}
                  >
                    <option>-- Seleccione un cliente --</option>
                    {customers.map(({ idcustomer, customerinfo }) => (
                      <option
                        key={idcustomer}
                        value={JSON.stringify({
                          id: idcustomer,
                          customerinfo: customerinfo,
                        })}
                      >
                        {customerinfo.namecustomer}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="suppliers__inputs">
                <TextField
                  id="outlined-basic"
                  label="Cantidad a despachar"
                  variant="outlined"
                  type="number"
                  name="cantidad"
                  value={cantidadIngresada}
                  onChange={(e) => setCantiadingresada(Number(e.target.value))}
                />
              </div>
              {enviado ? (
                <div>
                  <span>Ir a guia de despacho</span>
                </div>
              ) : null}
              <div className="suppliers__button">
                <button type="submit">Enviar a guia de Despacho</button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default ModalDespacho;
