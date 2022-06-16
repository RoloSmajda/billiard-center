import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBlJOjQiHEGTVFJf89Com04mgnjNlBC5j8",
    authDomain: "billiard-center.firebaseapp.com",
    databaseURL: "https://billiard-center-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "billiard-center",
    storageBucket: "billiard-center.appspot.com",
    messagingSenderId: "427655532386",
    appId: "1:427655532386:web:027d6015d848a7ce4e663b",
    measurementId: "G-YSBH11EG8C"
  };


  const app = initializeApp(firebaseConfig);

  export const db = getFirestore(app);