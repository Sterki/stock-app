import React from "react";
import { Link, NavLink } from "react-router-dom";
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
        Suppliers
      </NavLink>
      <NavLink
        to="/customers"
        activeClassName="active"
        className="navbar__links"
      >
        <AssignmentIcon />
        Customers
      </NavLink>
      <NavLink to="/panel" activeClassName="active" className="navbar__links">
        <LocalMallIcon />
        Products
      </NavLink>
      <NavLink
        to="/myprofile"
        activeClassName="active"
        className="navbar__links"
      >
        <AccountBoxIcon />
        My Profile
      </NavLink>
      <NavLink
        to="/administrator"
        activeClassName="active"
        className="navbar__links"
      >
        <SupervisorAccountIcon />
        User Administrator
      </NavLink>
    </nav>
  );
}
export default Navbar;
