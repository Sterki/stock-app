import React, { useState } from "react";
import "./Login.css";
import login from "./../images/login.png";
import {
  Backdrop,
  CircularProgress,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { auth } from "./../firebase";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function Login() {
  const classes = useStyles();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const history = useHistory();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { email, password } = user;
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim === "") {
      return setError("Todos los campos son Obligatorios");
    }
    auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log("login succesfully!");
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
          history.push("/suppliers");
        }, 1500);
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  return (
    <div className="login">
      <div className="login__containerImg">
        <img src={login} alt="loginimage" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="login__container">
          <h1>Login</h1>
          {error ? <Alert severity="error">{error}</Alert> : null}

          <div className="login__inputs">
            <TextField
              id="outlined-basic"
              label="Email"
              name="email"
              variant="outlined"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="login__inputs">
            <TextField
              id="outlined-basic"
              label="Contraseña"
              name="password"
              type="password"
              variant="outlined"
              value={password}
              onChange={handleChange}
            />
          </div>
          <div className="login__inputs">
            <button>Ingresar</button>
            <Link to="/register">Crear una cuenta</Link>
          </div>
        </div>
      </form>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />{" "}
        <span>Redireccionando hacia la pagina principal</span>
      </Backdrop>
    </div>
  );
}

export default Login;
