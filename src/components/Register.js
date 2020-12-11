import React, { useState } from "react";
import "./Login.css";
import register from "./../images/register.png";
import { TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import { auth } from "./../firebase";

function Register() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const { username, email, password, confirm } = userInfo;

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        result.user.updateProfile({
          displayName: username,
        });
        console.log(result);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <div className="login__container">
          <h1>Create an Account</h1>
          <div className="login__inputs">
            <TextField
              id="outlined-basic"
              label="Username"
              name="username"
              type="text"
              variant="outlined"
              value={username}
              onChange={handleChange}
            />
          </div>
          <div className="login__inputs">
            <TextField
              id="outlined-basic"
              label="Email"
              name="email"
              type="text"
              variant="outlined"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="login__inputs">
            <TextField
              id="outlined-basic"
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={password}
              onChange={handleChange}
            />
          </div>
          <div className="login__inputs">
            <TextField
              id="outlined-basic"
              label="Confirm"
              name="confirm"
              type="password"
              variant="outlined"
              value={confirm}
              onChange={handleChange}
            />
          </div>
          <div className="login__inputs">
            <button>Register Account</button>
            <Link to="/">Go to Login in</Link>
          </div>
        </div>
      </form>
      <div className="login__containerImg">
        <img src={register} alt="loginimage" />
      </div>
    </div>
  );
}

export default Register;
