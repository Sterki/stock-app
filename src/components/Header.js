import React, { useState } from "react";
import "./Header.css";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@material-ui/icons/Menu";
import Avatar from "@material-ui/core/Avatar";
import { useSelector, useDispatch } from "react-redux";
import { closeSesionAction } from "./../actions/usersActions";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";
import { Tooltip } from "@material-ui/core";
import Zoom from "@material-ui/core/Zoom";
import Navbar from "./Navbar";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Header() {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const classes = useStyles();
  const history = useHistory();
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleClickClose = () => {
    auth.signOut();
    dispatch(closeSesionAction());
    history.push("/");
  };
  return (
    <div className="header">
      <div className="header__menuicon">
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          {["left"].map((anchor) => (
            <React.Fragment key={anchor}>
              <MenuIcon
                style={{ color: "white" }}
                onClick={toggleDrawer(anchor, true)}
              />
              <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                <div className="header__toggledrawwer">
                  <div className="header__title">
                    <h1>App Stock</h1>
                  </div>
                  <Navbar />
                </div>
              </Drawer>
            </React.Fragment>
          ))}
        </IconButton>
        <div></div>
      </div>
      <div className="header__username">
        <span>
          Wellcome <strong>{user?.email}</strong>
        </span>
      </div>
      <div className="header__logoutavatar">
        <Tooltip title="Close Sesion" TransitionComponent={Zoom}>
          <Avatar
            alt={user?.email.toUpperCase()}
            src="/static/images/avatar/1.jpg"
            onClick={handleClickClose}
          />
        </Tooltip>
      </div>
    </div>
  );
}
export default Header;
