import { async } from '@firebase/util'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { db } from '../firebase-config'
import "../style.css"
import Modal from './Modal'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong, faArrowRight } from '@fortawesome/free-solid-svg-icons'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Match({ index, player1, player2, type, winner, matchId, matchesPath, scoresList, scoresPath, update }) {

  let wasPlayed = false
  if (winner === "") {
    wasPlayed = false
  } else {
    wasPlayed = true
  }

  const [isOpen, setIsOpen] = useState(false)

  const [winnerRadio, setWinnerRadio] = useState("")
  const [player1BallsLeft, setPlayer1BallsLeft] = useState()
  const [player2BallsLeft, setPlayer2BallsLeft] = useState()

  const getPlayer1BallsLeft = (event) => {
    setPlayer1BallsLeft(event.target.value)
  }
  const getPlayer2BallsLeft = (event) => {
    setPlayer2BallsLeft(event.target.value)
  }

  const updateMatch = async () => {
    const matchDoc = doc(db, matchesPath, matchId)
    const newData = { winner: winnerRadio }
    await updateDoc(matchDoc, newData)
  }

  const updateScoreTable = async () => {
    const player1Data = scoresList.find(player => player.player === player1)
    const player2Data = scoresList.find(player => player.player === player2)

    const player1NewData = {
      played: player1Data.played + 1,
      wins: (winnerRadio === player1) ? player1Data.wins + 1 : player1Data.wins,
      losses: (winnerRadio === player1) ? player1Data.losses : player1Data.losses + 1,
      ballsLeft: player1Data.ballsLeft + parseInt(player1BallsLeft),
      points: (winnerRadio === player1) ? player1Data.points + 3 : player1Data.points,
    }
    const player2NewData = {
      played: player2Data.played + 1,
      wins: (winnerRadio === player2) ? player2Data.wins + 1 : player2Data.wins,
      losses: (winnerRadio === player2) ? player2Data.losses : player2Data.losses + 1,
      ballsLeft: player2Data.ballsLeft + parseInt(player2BallsLeft),
      points: (winnerRadio === player2) ? player2Data.points + 3 : player2Data.points,
    }

    const player1Doc = doc(db, scoresPath, player1Data.id)
    const player2Doc = doc(db, scoresPath, player2Data.id)

    await updateDoc(player1Doc, player1NewData)
    await updateDoc(player2Doc, player2NewData)

    //console.log(player1Data, player2Data)

  }

  const notify = (type) => {
    if (type === "emptyRadio") {
      toast.error('Vyber víťaza zápasu!', {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (type === "tooManyBalls") {
      toast.error('Maximálny počet ostávajúcich gulí je 7!', {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (type === "lessThanZero") {
      toast.error('Minimálny počet ostávajúcich gulí je 0!', {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (type === "undefinedBalls") {
      toast.error('Zadaj počet ostávajúcich gulí!', {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  const evaluateMatch = async () => {
    if (winnerRadio === "") {
      notify("emptyRadio")
      return
    }
    if (player1BallsLeft > 7 || player2BallsLeft > 7) {
      notify("tooManyBalls")
      return
    }
    if (player1BallsLeft < 0 || player2BallsLeft < 0) {
      notify("lessThanZero")
      return
    }
    if (player1BallsLeft === undefined || player2BallsLeft === undefined) {
      notify("undefinedBalls")
      return
    }

    await updateMatch()
    if (type === "group") {
      await updateScoreTable()
    }

    setIsOpen(false)
    update(index)
  }

  return (
    <div className='match'>
      <div className='matchInfo'>
        <div className='matchTitle'>
          {(type === "group")
            ? `Zápas #${index + 1}`
            : (type === "semifinal")
              ? `Semifinále #${index + 1 - 6}`
              : `Finále`
          }
        </div>
        <div className='playersInfo'>
          <span className={(winner !== "") ? ((winner === player1) ? 'winner' : 'looser') : 'normal'}>
            {player1}
          </span>
          <span className='vs'>
            vs
          </span>
          <span className={(winner !== "") ? ((winner === player2) ? 'winner' : 'looser') : 'normal'}>
            {player2}
          </span>
        </div>
      </div>


      <div className='evaluateMatchButton'>
        <button
          onClick={() => setIsOpen(true)}
          disabled={wasPlayed}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>

        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          evaluateMatch={evaluateMatch}
        >
          <div className='modalTitle'>
            {`${player1} vs ${player2} vyhodnotenie.`}
          </div>


          <div className='modalInputs'>
            <div className='row'>
              <div className='modalSubTitle'>
                Počet zvyšných gulí
              </div>
              <div className='modalSubTitle'>
                Víťaz
              </div>
            </div>

            <div className='row'>
              <div>
                <input
                  id='balls1'
                  type="number"
                  value={(winnerRadio !== "" && winnerRadio === player1) ? 0 : null}
                  onChange={getPlayer1BallsLeft}
                  placeholder=" "
                  className='input'

                />
                <label for='balls1' className='label'>
                  {player1}
                </label>
              </div>

              <label className='radioContainer radio1'>
                <input
                  type="radio"
                  id="player1"
                  name="winner"
                  value={player1}
                  onChange={() => {
                    setWinnerRadio(player1)
                    setPlayer1BallsLeft('0')
                  }}
                />
                <span className='customRadio'></span>
              </label>
            </div>

            <div className='row'>
              <div>
                <input
                  id='balls2'
                  type="number"
                  value={(winnerRadio !== "" && winnerRadio === player2) ? 0 : null}
                  onChange={getPlayer2BallsLeft}
                  placeholder=" "
                  className='input'

                />
                <label for='balls2' className='label'>
                  {player2}
                </label>
              </div>

              <label className='radioContainer radio2'>
                <input
                  type="radio"
                  id="player2"
                  name="winner"
                  value={player2}
                  onChange={() => {
                    setWinnerRadio(player2)
                    setPlayer2BallsLeft('0')
                  }}
                />
                <span className='customRadio'></span>
              </label>
            </div>
          </div>


        </Modal>
        <ToastContainer
          position="bottom-center"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="toast"
        />
      </div>
    </div>

  )
}
