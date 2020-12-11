import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import "./Suppliers.css";
import db from "./../firebase";
import firebase from "firebase";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function Suppliers() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const userAuth = useSelector((state) => state.users.user);
  const [supplier, setSupplier] = useState({
    namesupplier: "",
    rutsupplier: "",
    address: "",
    city: "",
    province: "",
  });

  const { namesupplier, rutsupplier, address, city, province } = supplier;

  const handleChange = (e) => {
    setSupplier({
      ...supplier,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      namesupplier.trim() === "" ||
      rutsupplier.trim() === "" ||
      city.trim() === "" ||
      address.trim() === "" ||
      province.trim() === ""
    ) {
      setError("All the fields are required!");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else {
      db.collection("suppliers")
        .doc(rutsupplier)
        .set({
          name: namesupplier,
          address: address,
          city: city,
          province: province,
          creator: userAuth.email,
          created: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .catch((error) => {
          setError(error.message);
        });
      setOpen(true);
      setSupplier({
        namesupplier: "",
        rutsupplier: "",
        address: "",
        city: "",
        province: "",
      });
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <div className="suppliers">
      <form onSubmit={handleSubmit}>
        <div className="suppliers__container">
          <div className="suppliers__title">
            <h2>Suppliers</h2>
            {error && <Alert severity="error">{error}</Alert>}
          </div>
          <div className="suppliers__inputs">
            <TextField
              id="outlined-basic"
              label="Supplier Name"
              variant="outlined"
              name="namesupplier"
              value={namesupplier}
              onChange={handleChange}
            />
            <TextField
              id="outlined-basic"
              label="Id Supplier"
              variant="outlined"
              name="rutsupplier"
              value={rutsupplier}
              onChange={handleChange}
            />
          </div>
          <div className="suppliers__inputs2">
            <TextField
              id="outlined-basic"
              label="Address Supplier"
              variant="outlined"
              name="address"
              value={address}
              onChange={handleChange}
            />
          </div>
          <div className="suppliers__inputs3">
            <TextField
              id="outlined-basic"
              label="City"
              variant="outlined"
              name="city"
              value={city}
              onChange={handleChange}
            />
            <TextField
              id="outlined-basic"
              label="State / Province / Region"
              variant="outlined"
              name="province"
              value={province}
              onChange={handleChange}
            />
          </div>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              Supplier saved successfully
            </Alert>
          </Snackbar>
          <div className="suppliers__button">
            <button type="submit">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Suppliers;
