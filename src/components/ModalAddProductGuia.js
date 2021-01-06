import React from "react";
import { Link } from "react-router-dom";
import { FormControl, InputLabel, Select, TextField } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

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

function ModalAddProductGuia({
  openAddproduct,
  amount,
  handleOpenModalGuia,
  setAmount,
  handleClickEliminar,
  handleChange,
  listadoProductos,
  handleSubmit,
  handleCloseModalGuia,
}) {
  const classes = useStyles();
  const customerinfo = useSelector((state) => state.customers.customerinfo);
  console.log(listadoProductos);
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openAddproduct}
        onClose={handleCloseModalGuia}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openAddproduct}>
          <div className={classes.paper}>
            <div className="suppliers__titlemodal">
              <h3>Agregar producto a la Guia</h3>
            </div>
            {/* <div>
              {enviadoguia ? (
                <Alert severity="success">{enviadoguia}</Alert>
              ) : null}
            </div> */}
            <div className="suppliers__error">
              {/* {error && <Alert severity="error">{error}</Alert>} */}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="suppliers__inputs">
                <TextField
                  id="outlined-basic"
                  label="Nombre Cliente"
                  variant="outlined"
                  type="text"
                  disabled
                  value={customerinfo?.customerinfo.customerinfo.namecustomer}
                  name="customername"
                />
              </div>
              <div className="suppliers__inputs">
                <TextField
                  id="outlined-basic"
                  label="Nº Guia de despacho"
                  variant="outlined"
                  type="text"
                  disabled
                  value={customerinfo?.idnumeroguia}
                  name="numeroguia"
                />
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
                    Producto
                  </InputLabel>
                  <Select
                    className={classes.formControl}
                    native
                    // value={category}
                    onChange={handleChange}
                    label="Producto"
                    inputProps={{
                      name: "producto",
                      id: "outlined-age-native-simple",
                    }}
                  >
                    <option>-- Selecctione un Producto --</option>
                    {listadoProductos.map(({ idproducto, infodata }) => (
                      <option
                        key={idproducto}
                        value={JSON.stringify({
                          id: idproducto,
                          infodata: infodata,
                        })}
                      >
                        {infodata.name}
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
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <div className="suppliers__button">
                <button type="submit">Cargar producto a la guia</button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default ModalAddProductGuia;
