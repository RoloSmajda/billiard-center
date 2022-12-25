import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import "../style.css"
import "../mediaQueries.css"

export default function Header() {
  return (
    <div className='header'>
      
      <div  className="logo">
        <FontAwesomeIcon icon={faGlobe} className="logoIcon"></FontAwesomeIcon>
      </div>

      <div className='name'>
        BilliardCenter
      </div>
    </div>
  )
}
