import React, { useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Tooltip } from "@material-ui/core";
import "./Product.css";
import ProgressBar from "react-bootstrap/ProgressBar";
// import "bootstrap/dist/css/bootstrap.min.css";
import db from "./../firebase";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import WarningIcon from "@material-ui/icons/Warning";
import Swal from "sweetalert2";
// import "bootstrap/dist/css/bootstrap.min.css";

function Product({ id, infodata }) {
  const [open, setOpen] = useState(false);
  const [productoEliminar, setClienteEliminar] = useState();

  const handleClickOpen = (infodata) => {
    setOpen(true);
    setClienteEliminar(infodata.name);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const { stockmax, stockmin, amount } = infodata;

  const handleClickDelete = (id) => {
    if (id) {
      db.collection("stock")
        .doc(id)
        .delete()
        .then(function () {
          console.log("Producto eliminado correctamente");
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Producto Eliminado",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };
  let calculostock = Math.ceil((amount * 100) / stockmax);

  let calculostockmin = Math.ceil((stockmin * 100) / stockmax);

  let stockwarnig = Math.ceil((100 - calculostockmin) / 2) + calculostockmin;

  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1}>
        <TableCell>{infodata.supplier.nameproveedor}</TableCell>
        <TableCell>{infodata.name}</TableCell>
        <TableCell>{infodata.category}</TableCell>
        <TableCell>
          <strong>$</strong> {infodata.price}
        </TableCell>
        <TableCell>
          {infodata.amount} / <strong>{infodata.stockmax}</strong>
        </TableCell>
        <TableCell style={{ width: "100%" }}>
          {calculostock <= calculostockmin ? (
            <div
              className="product__divprogress"
              style={{
                width: `${calculostock}%`,
                backgroundColor: "#d9534f",
                position: "relative",
                textAlign: "center",
                padding: "0.2rem",
                borderRadius: "30px",
                color: "white",
              }}
            >
              {calculostock}%
            </div>
          ) : calculostock <= stockwarnig ? (
            <div
              style={{
                width: `${calculostock}%`,
                backgroundColor: "#f0ad4e",
                textAlign: "center",
                padding: "0.2rem",
                borderRadius: "30px",
                color: "white",
              }}
            >
              {calculostock}%
            </div>
          ) : calculostock > stockwarnig ? (
            <div
              style={{
                width: `${calculostock}%`,
                backgroundColor: "#5cb85c",
                textAlign: "center",
                padding: "0.2rem",
                borderRadius: "30px",
                color: "white",
              }}
            >
              {calculostock}%
            </div>
          ) : null}
        </TableCell>
        <TableCell>
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
        <DialogTitle id="alert-dialog-title">{`Está seguro de Eliminar a ${productoEliminar}`}</DialogTitle>
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
    </>
  );
}

export default Product;
