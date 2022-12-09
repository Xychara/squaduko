import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
    apiKey: "AIzaSyCa9BBGyti64rnhs4X3MsOMjvmPbCZg-0U",
    authDomain: "squaduko.firebaseapp.com",
    databaseURL: "https://squaduko-default-rtdb.firebaseio.com",
    projectId: "squaduko",
    storageBucket: "squaduko.appspot.com",
    messagingSenderId: "313474750237",
    appId: "1:313474750237:web:72311987e2cb403384b3f4"
  };

firebase.initializeApp(firebaseConfig);

export default firebase.database();