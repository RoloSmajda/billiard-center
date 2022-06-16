import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase-config'
import "../style.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckDouble, faArrowsRotate, faRepeat, faCheck } from '@fortawesome/free-solid-svg-icons'

export default function Round({ index, id, tournamentID, tournamentIndex, state }) {


  const [results, setResults] = useState([])

  let resultsPath = "tournaments/" + tournamentID + "/rounds/" + id + "/results"
  const resultsRef = collection(db, resultsPath)
  const resultsQuery = query(resultsRef, orderBy("points", "desc"))

  const getResults = async () => {
    const resultsData = await getDocs(resultsQuery)
    setResults(resultsData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  useEffect(() => {
    getResults()
    console.log("HERE");
  }, [state])

  

  const newTo = {
    pathname: "/round-detail/" + tournamentID + "/" + tournamentIndex + "/" + id + "/" + index,
  }

  return (
    <Link to={newTo} className="link roundLink">
      <div className='round'>
        <div className='roundTitle'>
          Kolo {index + 1}
          <FontAwesomeIcon className={`roundIcon ${(results.length === 0) ? "roundIconNotDone" : ""}`} icon={
            (results.length === 0)
              ? faArrowsRotate
              : faCheckDouble
          } />
        </div>
        <div className='roundResult'>
          {(results.length === 0) ? "" : results[0].player}
        </div>


      </div>
    </Link>

  )
}
