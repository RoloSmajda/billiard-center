import { React, useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, DocumentReference, query, where, orderBy, connectFirestoreEmulator } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import RoundList from "./RoundList";
import Table from "./Table";
import "../style.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

export default function TournamentDetail() {
  const [rounds, setRounds] = useState([])
  const [table, setTable] = useState([])

  const [newRoundState, setNewRoundState] = useState(false)

  let { index, id } = useParams()

  let roundsPath = "tournaments/" + id + "/rounds"
  const roundsRef = collection(db, roundsPath)
  const roundsQuery = query(roundsRef, orderBy("index", "desc"))

  let playersPath = "tournaments/" + id + "/players"
  const playersRef = collection(db, playersPath)
  const playersQuery = query(playersRef, orderBy("points", "desc"))



  const getRounds = async () => {
    const roundsData = await getDocs(roundsQuery)
    setRounds(roundsData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }
  const getTable = async () => {
    const tableData = await getDocs(playersQuery)
    setTable(tableData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }


  useEffect(() => {
    getRounds()
    getTable()


  }, [])

  const generatePlayersAndMatches = async (roundId) => {
    //Vytvorenie tabulky
    const scoreTableRef = collection(db, roundsPath + "/" + roundId + "/scoreTable")
    let players = []
    table.forEach(player => {
      addDoc(scoreTableRef, { player: player.name, played: 0, wins: 0, losses: 0, ballsLeft: 0, points: 0 })
      players.push(player.name)
    });

    //Vytvorenie zapasov
    let randomPlayers = players
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)

    const matchesRef = collection(db, roundsPath + "/" + roundId + "/matches")
    await addDoc(matchesRef, { index: 0, player1: randomPlayers[0], player2: randomPlayers[1], type: "group", winner: "" })
    await addDoc(matchesRef, { index: 1, player1: randomPlayers[2], player2: randomPlayers[3], type: "group", winner: "" })

    await addDoc(matchesRef, { index: 2, player1: randomPlayers[0], player2: randomPlayers[2], type: "group", winner: "" })
    await addDoc(matchesRef, { index: 3, player1: randomPlayers[3], player2: randomPlayers[1], type: "group", winner: "" })

    await addDoc(matchesRef, { index: 4, player1: randomPlayers[0], player2: randomPlayers[3], type: "group", winner: "" })
    await addDoc(matchesRef, { index: 5, player1: randomPlayers[1], player2: randomPlayers[2], type: "group", winner: "" })

    await addDoc(matchesRef, { index: 6, player1: "", player2: "", type: "semifinal", winner: "" })
    await addDoc(matchesRef, { index: 7, player1: "", player2: "", type: "semifinal", winner: "" })

    await addDoc(matchesRef, { index: 8, player1: "", player2: "", type: "final", winner: "" })


  }

  const newRound = async () => {
    setNewRoundState(false)

    //create document for new round
    const newDocRef = await addDoc(roundsRef, { index: rounds.length })

    //get rounds documents with new one
    await getRounds()

    //funkcia ktorá vytvorí tabuľku hráčov a z nej vygeneruje zápasy
    await generatePlayersAndMatches(newDocRef.id)

    setNewRoundState(true)
    
    
  }

  const temp = () =>{
    console.log("TEST");
  }

  return (
    <div className="tournamentDetail">
      <div className="tournamentDetailHeading">
        Turnaj {parseInt(index) + 1}
      </div>

      <Table list={table} />
      <RoundList
        list={rounds}
        tournamentID={id}
        tournamentIndex={index}
        state={newRoundState}
      />

      <div className="addButton" id="addBtn">
        <ThemeProvider theme={theme}>
            <Fab color="primary" aria-label="add" onClick={temp}>
                <AddIcon />
            </Fab>
        </ThemeProvider>
      </div>
    </div>
  )
}
