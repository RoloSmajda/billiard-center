import { useState, useEffect, cloneElement } from "react";
import TournamentList from "./components/TournamentList";
import Tournament from "./components/Tournament";
import { db } from "./firebase-config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { async } from "@firebase/util";
import MainComponent from "./components/MainComponent";
import { BrowserRouter } from "react-router-dom";


function App() {

  return (
    <>
    <BrowserRouter>
      <MainComponent />
    </BrowserRouter>
    
    </>
    

  );
}

export default App;
