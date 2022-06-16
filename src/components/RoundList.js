import React from 'react'
import Round from './Round'
import '../style.css'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase-config'

export default function RoundList({ list, tournamentID, tournamentIndex, state }) {
    if (Object.keys(list).length == 0) {
        return (
            <div className='noResults'>
                V tomto turnaji sa zatiaľ neodohrali žiadne kolá.
            </div>
        )
    }
    return (
        <div className='roundList'>
            {
                list.map((round, i) => {
                    return <Round
                        key={i}
                        index={round.index}
                        id={round.id}
                        tournamentID={tournamentID}
                        tournamentIndex={tournamentIndex}
                        state={state}
                    />
                })
            }
        </div>

    )
}
