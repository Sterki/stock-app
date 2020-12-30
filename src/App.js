import "./App.css";
import store from "./store";
import { Provider } from "react-redux";
import Login from "./components/Login";
import Register from "./components/Register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { auth } from "./firebase";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserAction } from "./actions/usersActions";
import PrincipalPage from "./components/PrincipalPage";
import Header from "./components/Header";
import { closeSesionAction } from "./actions/usersActions";
import Suppliers from "./components/Suppliers";
import Customers from "./components/Customers";
import Stock from "./components/Stock";
import ModalDespacho from "./components/ModalDespacho";
import GuiaDespacho from "./components/GuiaDespacho";

function wrappApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((result) => {
      if (result) {
        dispatch(
          getUserAction({
            displayName: result.displayName,
            email: result.email,
            photoUrl: result.photoURL,
            uid: result.uid,
          })
        );
      } else {
        dispatch(closeSesionAction());
      }
    });
  }, [dispatch]);

  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/guiadespacho">
              <Header />
              <GuiaDespacho />
            </Route>
            <Route path="/despacho">
              <ModalDespacho />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/administrator">
              <Header />
              <PrincipalPage />
            </Route>
            <Route path="/myprofile">
              <Header />
              <PrincipalPage />
            </Route>
            <Route path="/customers">
              <Header />
              <Customers />
            </Route>
            <Route path="/suppliers">
              <Header />
              <Suppliers />
            </Route>
            <Route path="/panel">
              <Header />
              <Stock />
            </Route>
            <Route path="/">
              <Login />
            </Route>
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default wrappApp;
