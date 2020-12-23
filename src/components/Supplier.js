import React, { useEffect, useState } from "react";
import "./Supplier.css";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { TextField, Tooltip } from "@material-ui/core";
import db from "./../firebase";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import WarningIcon from "@material-ui/icons/Warning";
import Swal from "sweetalert2";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { getSupplierToEditAction } from "../actions/supplierActions";
import MuiAlert from "@material-ui/lab/Alert";

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
function Supplier({ idsupplier, infodata }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [proveedorEliminar, setProveedorEliminar] = useState();
  const dispatch = useDispatch();
  const useAuth = useSelector((state) => state.users.user);

  const suppliertoedit = useSelector((state) => state.suppliers.suppliertoedit);
  const [errorForm, setErrorForm] = useState("");
  const [proveedor, saveProveedor] = useState({
    rut: "",
    name: "",
    creator: "",
    city: "",
    address: "",
    province: "",
  });

  useEffect(() => {
    saveProveedor(suppliertoedit);
  }, [suppliertoedit]);

  if (suppliertoedit === null) return null;
  const { name, address, city, province, rut } = proveedor;

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleClickOpen = (infodata) => {
    setOpen(true);
    setProveedorEliminar(infodata.name);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickDelete = (idsupplier) => {
    if (idsupplier) {
      db.collection("suppliers")
        .doc(idsupplier)
        .delete()
        .then((result) => {
          console.log("proveedor eliminado");
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Proveedor Eliminado",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };
  const handleChange = (e) => {
    saveProveedor({
      ...proveedor,
      [e.target.name]: e.target.value,
    });
  };
  const handleClickOpenEditar = (infodata) => {
    // here add the info data to save into our data layer
    // console.log("el id del proveedor es:", id);
    // console.log("el proveedor a editar es:", infodata);
    setOpenModal(true);
    // setSupplierToEdit({ id, infodata });

    dispatch(getSupplierToEditAction(infodata));
    // console.log(proveedor);
  };

  const handleClickEditar = (e) => {
    e.preventDefault();
    // console.log(proveedor);
    if (
      name.trim() === "" ||
      rut.trim() === "" ||
      address.trim() === "" ||
      province.trim() === "" ||
      city.trim() === ""
    ) {
      setErrorForm("Debe ingresar todos los campos");
      setTimeout(() => {
        setErrorForm("");
      }, 3000);
    } else {
      db.collection("suppliers")
        .doc(idsupplier)
        .update({
          name: name.toUpperCase(),
          rut: rut,
          address: address.toUpperCase(),
          province: province.toUpperCase(),
          city: city.toUpperCase(),
          creator: useAuth.email,
          created: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function () {
          console.log("uctualizado correctamente!");
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Proveedor Editado con exito",
            showConfirmButton: false,
            timer: 1500,
          });
          setOpenModal(false);
        })
        .catch(function (error) {
          console.log(error.message);
        });
    }
  };
  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1}>
        <TableCell>{infodata.rut}</TableCell>
        <TableCell>{infodata.name}</TableCell>
        <TableCell>{infodata.address}</TableCell>
        <TableCell>{infodata.city}</TableCell>
        <TableCell>{infodata.creator}</TableCell>
        <TableCell>
          <Tooltip title="Editar Proveedor">
            <EditIcon onClick={(e) => handleClickOpenEditar(infodata)} />
          </Tooltip>
          <Tooltip title="Eliminar Proveedor">
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
        <DialogTitle id="alert-dialog-title">
          {`Estas seguro que quieres eliminar ${proveedorEliminar}`}
        </DialogTitle>

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
            onClick={(e) => handleClickDelete(idsupplier)}
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
                <h3>Editar Proveedor</h3>
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
                    name="name"
                    value={name}
                    onChange={handleChange}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Rut"
                    variant="outlined"
                    name="rut"
                    value={rut}
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

export default Supplier;
