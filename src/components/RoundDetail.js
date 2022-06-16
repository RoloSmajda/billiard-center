import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, getDocs, addDoc, DocumentReference, query, where, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase-config';
import RoundTable from './RoundTable';
import MatchList from './MatchList';
import { async } from '@firebase/util';
import { Link } from 'react-router-dom'
import "../style.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightToBracket, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'



export default function RoundDetail() {

  let { tournamentID, tournamentIndex, id, index } = useParams()

  const [matchesInfo, setMatchesInfo] = useState([])

  const [dontUpdate, setDontUpdate] = useState(false)

  const [matches, setMatches] = useState([])
  const [scores, setScores] = useState([])

  let scoresPath = "tournaments/" + tournamentID + "/rounds/" + id + "/scoreTable"
  const scoresRef = collection(db, scoresPath)
  const scoresQuery = query(scoresRef, orderBy("points", "desc"), orderBy("ballsLeft", "asc"))

  let matchesPath = "tournaments/" + tournamentID + "/rounds/" + id + "/matches"
  const matchesRef = collection(db, matchesPath)
  const matchesQuery = query(matchesRef, orderBy("index", "asc"))

  let playersPath = "tournaments/" + tournamentID + "/players"
  const playersRef = collection(db, playersPath)
  const playersQuery = query(playersRef, orderBy("points", "desc"))

  const getTournamentPlayers = async () => {
    const data = await getDocs(playersQuery)
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  }

  const getScores = async () => {
    if (!dontUpdate) {
      const scoresData = await getDocs(scoresQuery)
      setScores(scoresData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
  }
  const getCurrentScores = async () => {
    const scoresData = await getDocs(scoresQuery)
    return scoresData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

  }

  const getMatches = async () => {
    const matchesData = await getDocs(matchesQuery)
    setMatches(matchesData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }
  const getCurrentMatches = async () => {
    const matchesData = await getDocs(matchesQuery)
    return matchesData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  }

  const getMatchesInfo = async () => {
    let tmp = []
    const currentMatches = await getCurrentMatches()
    for (let i = 0; i < 9; i++) {
      if (currentMatches[i].winner === "") {
        tmp.push({ index: i, done: false })
      }
      else {
        tmp.push({ index: i, done: true })
      }
    }
    setMatchesInfo(tmp)
  }

  const generatePlayOffMatches = async () => {
    const currentMatches = await getCurrentMatches()
    if (currentMatches[6].player1 === "") {
      const groupMatchesInfo = matchesInfo.slice(0, 5 + 1)
      let isGroupFinneshed = groupMatchesInfo.every(match => match.done === true)

      if (isGroupFinneshed) {
        const scoresCurrent = await checkForSameScore(await getCurrentScores())


        const semi1Doc = doc(db, matchesPath, matches[6].id)
        const semi1Data = { player1: scoresCurrent[0].player, player2: scoresCurrent[3].player }
        await updateDoc(semi1Doc, semi1Data)

        const semi2Doc = doc(db, matchesPath, matches[7].id)
        const semi2Data = { player1: scoresCurrent[1].player, player2: scoresCurrent[2].player }
        await updateDoc(semi2Doc, semi2Data)
      }
      getMatches()
    }
  }

  const generateFinale = async () => {
    const currentMatches = await getCurrentMatches()
    if (currentMatches[8].player1 === "") {
      const semifinalMatchesInfo = matchesInfo.slice(6, 7 + 1)
      let isSemiFinneshed = semifinalMatchesInfo.every(match => match.done === true)

      if (isSemiFinneshed) {
        console.log("FINALE");
        const finalDoc = doc(db, matchesPath, matches[8].id)
        const finalData = { player1: currentMatches[6].winner, player2: currentMatches[7].winner }
        await updateDoc(finalDoc, finalData)
      }
      getMatches()
    }


  }

  const evaluateRound = async () => {
    //pripocitat do tabulky turnaja body

    const currentMatches = await getCurrentMatches()

    const semi1Losser = { player: (currentMatches[6].winner === currentMatches[6].player1) ? currentMatches[6].player2 : currentMatches[6].player1, tablePosition: 0 }
    const semi2Losser = { player: (currentMatches[7].winner === currentMatches[7].player1) ? currentMatches[7].player2 : currentMatches[7].player1, tablePosition: 0 }

    const winner = currentMatches[8].winner
    const second = (currentMatches[8].winner === currentMatches[8].player1) ? currentMatches[8].player2 : currentMatches[8].player1
    let third = ""
    let fourth = ""

    const currentScores = await getCurrentScores()
    currentScores.forEach((player, i) => {
      if (player.player === semi1Losser.player) {
        semi1Losser.tablePosition = i
      }
      if (player.player === semi2Losser.player) {
        semi2Losser.tablePosition = i
      }
    })


    if (semi1Losser.tablePosition < semi2Losser.tablePosition) {
      third = semi1Losser.player
      fourth = semi2Losser.player
    } else {
      third = semi2Losser.player
      fourth = semi1Losser.player
    }


    const finalResults = [
      { player: winner, points: 100 },
      { player: second, points: 70 },
      { player: third, points: 50 },
      { player: fourth, points: 30 },
    ]

    console.log(finalResults)
    const resultsRef = collection(db, "tournaments/" + tournamentID + "/rounds/" + id + "/results")

    finalResults.forEach(result => {
      addDoc(resultsRef, result)
    })


    const tournamentPlayers = await getTournamentPlayers()
    tournamentPlayers.forEach(async (player) => {
      var result = finalResults.find(r => {
        return r.player === player.name
      })

      const playerDoc = doc(db, playersPath, player.id)
      const data = { points: player.points + result.points }
      await updateDoc(playerDoc, data)
    })



  }

  const checkForSameScore = async (scoresToCheck) => {
    let newScores = [...scoresToCheck]
    scoresToCheck.forEach((player1, i) => {
      scoresToCheck.forEach((player2, j) => {
        if (player1 !== player2) {
          if (player1.points === player2.points && player1.ballsLeft == player2.ballsLeft) {

            let match = matches.find(match => {
              return match.player1 === player1.player && match.player2 === player2.player
            })

            if (match !== undefined) {
              console.log(match)
              if (i > j && match.winner === player1.player) {
                console.log(i, player1.player);
                console.log(j, player2.player);

                const tmp = newScores[i]
                newScores[i] = newScores[j]
                newScores[j] = tmp
              }


            }

          }
        }
      })
    })

    setScores(newScores)
    setDontUpdate(true)
    // newScores.forEach(async player => {
    //   const playerDoc = doc(db, scoresPath, player.id)
    //   await updateDoc(playerDoc, player)
    // });

    return newScores
  }

  useEffect(() => {
    getScores()
    getMatches()

    getMatchesInfo()
  }, [])

  const update = async (index) => {
    await getMatches()
    await getScores()

    matchesInfo[index].done = true

    generatePlayOffMatches()
    generateFinale()

    if (index === 8) {
      evaluateRound()
    }

  }

  const newTo = {
    pathname: "/tournament-detail/" + tournamentIndex + "/" + tournamentID
  }

  return (
    <div className='roundDetail'>
      <div className='tournamentDetailHeading'>
        Kolo {parseInt(index) + 1}
        <Link to={newTo} className="link tournamentLink">
          <span>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </span>
        </Link>
      </div>
      <RoundTable scores={scores} />


      <MatchList
        list={matches}
        matchesPath={matchesPath}
        scoresList={scores}
        scoresPath={scoresPath}
        update={update}
      />


    </div>
  )
}
