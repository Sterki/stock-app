import React, { useEffect, useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Tooltip } from "@material-ui/core";
import db from "./../firebase";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import WarningIcon from "@material-ui/icons/Warning";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { TextField } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import MuiAlert from "@material-ui/lab/Alert";

import EditIcon from "@material-ui/icons/Edit";
import { getCustomerToEditAction } from "../actions/customerActions";

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function Customer({ id, infodata }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [clienteEliminar, setClienteEliminar] = useState();
  const clienteEdit = useSelector((state) => state.customers.customer);
  const userAuth = useSelector((state) => state.users.user);
  const [cliente, saveCliente] = useState({});
  const [errorForm, setErrorForm] = useState("");
  useEffect(() => {
    saveCliente(clienteEdit);
  }, [clienteEdit]);
  if (typeof cliente === "undefined") return null;

  const {
    namecustomer,
    rutcustomer,
    address,
    city,
    province,
    movil,
    phone,
    email,
  } = cliente;

  const handleClickOpen = (infodata) => {
    setOpen(true);
    setClienteEliminar(infodata.namecustomer);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // here fancy code to edit a customer
  const handleClickOpenModal = (infodata) => {
    setOpenModal(true);
    dispatch(getCustomerToEditAction(infodata));
  };
  const handleChange = (e) => {
    saveCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };
  const handleClickDelete = (id) => {
    if (id) {
      db.collection("customers")
        .doc(id)
        .delete()
        .then(function () {
          console.log("cliente eliminado correctamente");
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Cliente Eliminado",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  const handleClickEditar = (e) => {
    e.preventDefault();
    if (
      namecustomer.trim() === "" ||
      rutcustomer.trim() === "" ||
      address.trim() === "" ||
      email.trim() === "" ||
      province.trim() === "" ||
      city.trim() === ""
    ) {
      setErrorForm("Todos los campos son obligatorios!");
      setTimeout(() => {
        setErrorForm("");
      }, 3000);
    } else {
      db.collection("customers")
        .doc(id)
        .update({
          namecustomer: namecustomer.toUpperCase(),
          rutcustomer: rutcustomer,
          address: address.toUpperCase(),
          email: email.toUpperCase(),
          phone: phone,
          province: province.toUpperCase(),
          movil: movil,
          city: city.toUpperCase(),
          creator: userAuth.email,
        })
        .then(function () {
          console.log("actualizado correctamente!");
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Cliente Editado con exito",
            showConfirmButton: false,
            timer: 1500,
          });
          setOpenModal(false);
        })
        .catch(function (error) {
          console.log("hubo un error");
        });
    }
  };
  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1}>
        <TableCell>{infodata.rutcustomer}</TableCell>
        <TableCell>{infodata.namecustomer}</TableCell>
        <TableCell>{infodata.address}</TableCell>
        <TableCell>{infodata.city}</TableCell>
        <TableCell>{infodata.email}</TableCell>
        <TableCell>
          {infodata.phone ? infodata.phone : infodata.movil}
        </TableCell>
        <TableCell>
          <Tooltip title="Editar Cliente">
            <EditIcon onClick={(e) => handleClickOpenModal(infodata)} />
          </Tooltip>
          <Tooltip title="Eliminar Cliente">
            <DeleteForeverIcon onClick={(e) => handleClickOpen(infodata)} />
          </Tooltip>
        </TableCell>
      </TableRow>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <WarningIcon />
          {/* <DialogContentText id="alert-dialog-description">
              Una vez eliminado no podras
            </DialogContentText> */}
        </DialogContent>
        <DialogTitle id="alert-dialog-title">{`Está seguro de Eliminar a ${clienteEliminar}`}</DialogTitle>

        <DialogActions
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button className="supplier__buttondisagree" onClick={handleClose}>
            Cancelar
          </button>
          <button
            className="supplier__buttonagree"
            onClick={(e) => handleClickDelete(id)}
          >
            Aceptar
          </button>
        </DialogActions>
      </Dialog>
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openModal}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={classes.paper}>
              <div className="suppliers__titlemodal">
                <h3>Editar Cliente</h3>
              </div>
              <div className="suppliers__error">
                {errorForm && <Alert severity="error">{errorForm}</Alert>}
              </div>
              <form>
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
                  <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={email}
                    onChange={handleChange}
                  />
                </div>
                <div className="suppliers__inputs">
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
                    label="Provincia"
                    variant="outlined"
                    name="province"
                    value={province}
                    onChange={handleChange}
                  />
                </div>

                <div className="suppliers__inputs3">
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
                    label="Teléfono (opcional)"
                    variant="outlined"
                    name="phone"
                    value={phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="suppliers__button">
                  <button type="submit" onClick={handleClickEditar}>
                    Editar
                  </button>
                </div>
              </form>
            </div>
          </Fade>
        </Modal>
      </div>
    </>
  );
}

export default Customer;
