import { React, useState, useEffect } from "react";
import TournamentList from "./TournamentList";
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'


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


    return (
        <div className="home">
            
            <TournamentList list={tournaments} />

            <div className="newTournamentButton" onClick={newTournament}>
                <div className="layer"/>
                <FontAwesomeIcon icon={faPlusCircle} className="plusIcon" />
                Nový Turnaj
            </div>

        </div>
    )
}
