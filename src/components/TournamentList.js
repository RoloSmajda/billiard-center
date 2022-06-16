import React from 'react'
import Tournament from './Tournament'

export default function TournamentList({ list }) {
  if (Object.keys(list).length == 0) {
    return (
        <div className='noResults'>
            Loading tournaments...
        </div>
    )
}
  
  return (
    list.map((tournament, i) => {
      return <Tournament
        key={i}
        index={tournament.index}
        id={tournament.id}
      />
    })

  )
}
