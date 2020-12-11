import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBO3KwY7lZaUXNBHhxk3dJsgHi0TXQkxTE",
  authDomain: "stock-app-31f8d.firebaseapp.com",
  projectId: "stock-app-31f8d",
  storageBucket: "stock-app-31f8d.appspot.com",
  messagingSenderId: "645633609284",
  appId: "1:645633609284:web:32475934b87b0282743611",
  measurementId: "G-YTEQLQSQP4",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebaseApp.auth();
const db = firebaseApp.firestore();

export { auth };
export default db;
