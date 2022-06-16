import React from 'react'
import "../style.css"

export default function Modal({ open, children, onClose, evaluateMatch }) {
  if (!open) {
    return null
  }
  return (
    <>
      <div className='overlay' onClick={onClose} />
      <div className='modal'>
        {children}
        <div className='modalControls'>
          <span onClick={onClose}>SPAŤ</span>
          <span onClick={evaluateMatch}>OK</span>
        </div>
      </div>
    </>
  )
}
