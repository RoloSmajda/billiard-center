import { React, useState, useEffect } from "react";
import TournamentList from "./TournamentList";
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import $ from 'jquery'

const theme = createTheme({
    status: {
      danger: '#e53e3e',
    },
    palette: {
      primary: {
        main: '#00E676',
        darker: '#053e85',
      },
      neutral: {
        main: '#64748B',
        contrastText: '#fff',
      },
    },
  });



export default function Home() {

    const [tournaments, setTournaments] = useState([])

    const tournamentsRef = collection(db, "tournaments")
    const tournamentsQuery = query(tournamentsRef, orderBy("index", "desc"))

    const getTournaments = async () => {
        const data = await getDocs(tournamentsQuery)
        setTournaments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    useEffect(() => {
        getTournaments()

    }, [])

    const setPlayers = async (tournamentId) => {
        const players = ["Aďo", "Marek", "Tomáš", "Rolo"]
        const playersRef = collection(db, "tournaments/" + tournamentId + "/players")

        for (let i = 0; i < 4; i++) {
            await addDoc(playersRef, { name: players[i], points: 0 })
        }
    }

    const newTournament = async () => {
        //insert new tournament document
        let newIndex = 0
        if (tournaments.length > 0) {
            newIndex = tournaments[0].index + 1
        }

        const newTournamentRef = await addDoc(tournamentsRef, { index: newIndex })

        setPlayers(newTournamentRef.id)

        getTournaments()

    }


    window.addEventListener('scroll', () => {
        if($(window).scrollTop() <= 1){
            $('.addButton').fadeIn();
        }else{
            $('.addButton').fadeOut();
        }
    });


    return (
        <div className="home">
            
            <TournamentList list={tournaments}/>

            <div className="addButton" id="addBtn">
                <ThemeProvider theme={theme}>
                    <Fab className="addButtonBtn" color="primary" aria-label="add" onClick={newTournament}>
                        <AddIcon />
                    </Fab>
                </ThemeProvider>
            </div>
            

        </div>
    )
}
