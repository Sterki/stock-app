import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import BusinessIcon from "@material-ui/icons/Business";
import AssignmentIcon from "@material-ui/icons/Assignment";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink
        to="/suppliers"
        exact
        activeClassName="active"
        className="navbar__links"
      >
        <BusinessIcon />
        Proveedores
      </NavLink>
      <NavLink
        to="/customers"
        activeClassName="active"
        className="navbar__links"
      >
        <AssignmentIcon />
        Clientes
      </NavLink>
      <NavLink to="/panel" activeClassName="active" className="navbar__links">
        <LocalMallIcon />
        Stock
      </NavLink>
      <NavLink
        to="/myprofile"
        activeClassName="active"
        className="navbar__links"
      >
        <AccountBoxIcon />
        Mi Perfil
      </NavLink>
      <NavLink
        to="/administrator"
        activeClassName="active"
        className="navbar__links"
      >
        <SupervisorAccountIcon />
        Administrar Usuarios
      </NavLink>
    </nav>
  );
}
export default Navbar;
