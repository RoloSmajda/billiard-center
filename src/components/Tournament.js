import React from 'react'
import { Link } from 'react-router-dom'
import "../style.css"

export default function Tournament({ index, id }) {
  const newTo = {
    pathname: "/tournament-detail/" + index + "/" + id
  }

  return (
    <div className='tournament'>
      <Link to={newTo} className="link tournamentLink">

        <div className='shadow'>
        </div>
        <img src={require('../img/thumbnail3.jpg')} className='tournamentImg'/>

        <div className='tournamentTitle'>
          Turnaj {index + 1}
        </div>

      </Link>
    </div>


  )
}
