import React, { useEffect } from "react";
import "./PrincipalPage.css";
import { auth } from "./../firebase";
import { useHistory } from "react-router-dom";

function PrincipalPage() {
  const history = useHistory();
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        history.push("/");
      } else {
        console.log("wellcome!!");
      }
    });
  }, [history]);

  return (
    <div className="principalpage">
      <h1>Principal Page</h1>
    </div>
  );
}

export default PrincipalPage;
