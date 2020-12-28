import React, { useEffect, useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { FormControl, InputLabel, Select, Tooltip } from "@material-ui/core";
import "./Product.css";

// import "bootstrap/dist/css/bootstrap.min.css";
import db from "./../firebase";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import WarningIcon from "@material-ui/icons/Warning";
import Swal from "sweetalert2";
import EditIcon from "@material-ui/icons/Edit";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";

//modal
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import { productToEditAction } from "../actions/productActions";
import MuiAlert from "@material-ui/lab/Alert";
import DescriptionIcon from "@material-ui/icons/Description";

//opciones para la cantidad
import QueueIcon from "@material-ui/icons/Queue";

//custom hooks here
import useOpenModalDespacho from "./../CustomHooks/useOpenModalDespacho";
import ModalDespacho from "./ModalDespacho";

// import "bootstrap/dist/css/bootstrap.min.css";

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

function Product({ id, infodata }) {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const categorys = useSelector((state) => state.products.categorys);

  const classes = useStyles();
  const [error, setError] = useState("");
  const [productoEliminar, setClienteEliminar] = useState();
  const [suppliers, setSuppliers] = useState([]);
  const dispatch = useDispatch();

  //custok hook para despacho

  const {
    customers,
    valor,
    openModalDespacho,
    handleCloseModalDespacho,
    handleClickOpenDespacho,
    handleChangePrice,
    handleSubmitPrice,
  } = useOpenModalDespacho();

  // here getting the producttoedit to show into ours inputs

  const [producto, saveProducto] = useState({
    supplier: "",
    category: "",
    amount: "",
    stockmin: "",
    stockmax: "",
    price: "",
    name: "",
  });

  const productedit = useSelector((state) => state.products.producttoedit);

  useEffect(() => {
    db.collection("suppliers").onSnapshot((snapshot) => {
      setSuppliers(snapshot.docs.map((doc) => doc.data()));
    });
  }, []);

  useEffect(() => {
    saveProducto(productedit);
  }, [productedit]);

  const { supplier, category } = producto;

  const handleClickOpen = (infodata) => {
    setOpen(true);
    setClienteEliminar(infodata.name);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // fancy code to edit a product

  const handleClickOpenModal = (infodata) => {
    setOpenModal(true);
    dispatch(productToEditAction(infodata));
  };

  const { stockmax, stockmin, amount } = infodata;

  // handle PARA EL SELECT DE PROVEEDORES

  const handleChangeSelect = (e) => {
    saveProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeinfo = (e) => {
    saveProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };
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

  const handleClickEditarProducto = (e) => {
    e.preventDefault();

    if (
      producto.name.trim() === "" ||
      producto.price === "" ||
      producto.stockmax === "" ||
      producto.stockmin === "" ||
      producto.supplier.trim() === "" ||
      producto.amount === "" ||
      producto.category.trim() === ""
    ) {
      setError("Todos los campos son obligatorios!");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      db.collection("stock")
        .doc(id)
        .update({
          amount: producto.amount,
          category: producto.category.toUpperCase(),
          name: producto.name.toUpperCase(),
          price: producto.price,
          stockmin: producto.stockmin,
          stockmax: producto.stockmax,
          supplier: producto.supplier.toUpperCase(),
          created: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function () {
          console.log("producto editado correctamente!");
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Producto Editado con exito",
            showConfirmButton: false,
            timer: 1500,
          });
          setOpenModal(false);
        })
        .catch(function (error) {
          console.log("hubo un error al editar");
        });
    }
  };

  let calculostock = Math.ceil((amount * 100) / stockmax);

  let calculostockmin = Math.ceil((stockmin * 100) / stockmax);

  let stockwarnig = Math.ceil((100 - calculostockmin) / 2) + calculostockmin;

  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1}>
        <TableCell>{infodata.productcode}</TableCell>
        <TableCell>{infodata.supplier}</TableCell>
        <TableCell>{infodata.name}</TableCell>
        <TableCell>{infodata.category}</TableCell>
        <TableCell>
          <strong>$</strong> {infodata.price} /u
        </TableCell>
        <TableCell id="product__addcantidad">
          {infodata.stockmin} / {infodata.amount} /{" "}
          <strong>{infodata.stockmax}</strong>{" "}
          <Tooltip title="Agregar cantidad">
            <QueueIcon />
          </Tooltip>
        </TableCell>
        <TableCell style={{ width: "300px" }}>
          {calculostock <= calculostockmin ? (
            <div
              className="product__divprogress"
              style={{
                width: `${calculostock > 100 ? 100 : calculostock}%`,
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
                width: `${calculostock > 100 ? 100 : calculostock}%`,
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
        <TableCell id="product__celloption">
          <Tooltip title="Despachar">
            <DescriptionIcon
              id="product__despacho"
              onClick={(e) => handleClickOpenDespacho(infodata, id)}
              // onClick={(e) => handleClickOpenDespacho(infodata)}
            />
          </Tooltip>
          <Tooltip title="Editar Producto">
            <EditIcon
              id="product__edit"
              onClick={(e) => handleClickOpenModal(infodata)}
            />
          </Tooltip>
          <Tooltip title="Eliminar Producto">
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
                <h3>Editar Producto</h3>
              </div>
              <div className="suppliers__error">
                {error && <Alert severity="error">{error}</Alert>}
              </div>
              <form>
                <div className="product__codeproduct">
                  <span>
                    Código del producto: <strong>{infodata.productcode}</strong>
                  </span>
                </div>
                <div className="suppliers__inputs">
                  <FormControl
                    variant="outlined"
                    style={{ width: "100%", marginBottom: "1rem" }}
                  >
                    <InputLabel htmlFor="outlined-age-native-simple">
                      Proveedor
                    </InputLabel>
                    <Select
                      className={classes.selectControlProveedor}
                      native
                      value={supplier}
                      label="Proveedor"
                      onChange={handleChangeSelect}
                      inputProps={{
                        name: "supplier",
                        id: "outlined-age-native-simple",
                      }}
                    >
                      {suppliers.map((prov) => (
                        <option key={prov.rut} value={prov.name}>
                          {prov.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    style={{
                      width: "100%",
                      marginBottom: "1rem",
                      marginLeft: "1rem",
                    }}
                  >
                    <InputLabel htmlFor="outlined-age-native-simple">
                      Categoria
                    </InputLabel>
                    <Select
                      className={classes.formControl}
                      native
                      value={category}
                      onChange={handleChangeinfo}
                      label="Categoria"
                      inputProps={{
                        name: "category",
                        id: "outlined-age-native-simple",
                      }}
                    >
                      <option value={producto.category}>
                        {producto.category}
                      </option>
                      {categorys.map((cate) => (
                        <option key={cate.id} value={cate.categoria}>
                          {cate.categoria}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="suppliers__inputs">
                  <TextField
                    id="outlined-basic"
                    label="Nombre producto"
                    variant="outlined"
                    name="name"
                    value={producto.name}
                    onChange={handleChangeinfo}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Precio Unitario"
                    variant="outlined"
                    type="number"
                    name="price"
                    value={producto.price}
                    onChange={handleChangeinfo}
                  />
                </div>
                <div className="suppliers__inputs3">
                  <TextField
                    id="outlined-basic"
                    label="Cantidad a ingresar"
                    variant="outlined"
                    name="amount"
                    value={producto.amount}
                    onChange={handleChangeinfo}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Stock minimo"
                    variant="outlined"
                    name="stockmin"
                    value={producto.stockmin}
                    onChange={handleChangeinfo}
                  />
                  <TextField
                    id="outlined-basic"
                    style={{ width: "100%", marginLeft: "1rem" }}
                    label="Stock maximo"
                    variant="outlined"
                    name="stockmax"
                    value={producto.stockmax}
                    onChange={handleChangeinfo}
                  />
                </div>
                <div className="suppliers__button">
                  <button type="submit" onClick={handleClickEditarProducto}>
                    Editar
                  </button>
                </div>
              </form>
            </div>
          </Fade>
        </Modal>
      </div>
      <div>
        <ModalDespacho
          idproduct={id}
          customers={customers}
          valor={valor}
          openModalDespacho={openModalDespacho}
          handleCloseModalDespacho={handleCloseModalDespacho}
          handleChangePrice={handleChangePrice}
          handleSubmitPrice={handleSubmitPrice}
        />
      </div>
    </>
  );
}

export default Product;
