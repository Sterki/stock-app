import React, { useState } from "react";
import "./Supplier.css";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Tooltip } from "@material-ui/core";
import db from "./../firebase";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import WarningIcon from "@material-ui/icons/Warning";

function Supplier({ id, infodata }) {
  const [open, setOpen] = React.useState(false);
  const [proveedorEliminar, setProveedorEliminar] = useState();

  const handleClickOpen = (infodata) => {
    setOpen(true);
    setProveedorEliminar(infodata.name);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickDelete = (id) => {
    setOpen(false);
    db.collection("suppliers")
      .doc(id)
      .delete()
      .then(function () {
        console.log("proveedor eliminado correctamente");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1}>
        <TableCell>{id}</TableCell>
        <TableCell>{infodata.name}</TableCell>
        <TableCell>{infodata.address}</TableCell>
        <TableCell>{infodata.city}</TableCell>
        <TableCell>{infodata.creator}</TableCell>
        <TableCell>
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
            onClick={(e) => handleClickDelete(id)}
          >
            Aceptar
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Supplier;
