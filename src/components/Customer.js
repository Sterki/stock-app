import React, { useState } from "react";
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
function Customer({ id, infodata }) {
  const [open, setOpen] = useState(false);
  const [clienteEliminar, setClienteEliminar] = useState();

  const handleClickOpen = (infodata) => {
    setOpen(true);
    setClienteEliminar(infodata.namecustomer);
  };
  const handleClose = () => {
    setOpen(false);
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
  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1}>
        <TableCell>{infodata.rutcustomer}</TableCell>
        <TableCell>{infodata.namecustomer}</TableCell>
        <TableCell>{infodata.address}</TableCell>
        <TableCell>{infodata.city}</TableCell>
        <TableCell>{infodata.email}</TableCell>
        <TableCell>{infodata.phone ? infodata.phone : "Sin datos"}</TableCell>
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
    </>
  );
}

export default Customer;
