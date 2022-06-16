import React from 'react'

export default function RoundTable({ scores }) {
    if (Object.keys(scores).length == 0) {
        return (
            <div className='noResults'>
                Loading table...
            </div>
        )
    }

    return (
        <div className='roundTable'>
            <table>
                <thead><th className='roundTablePlayerName'>Hráč</th><th>Z</th><th>V</th><th>P</th><th>G</th><th>B</th></thead>
                {
                    scores.map((player, i) => {
                        return <tbody key={i}>
                            <tr>
                                <td className='roundTablePlayerName'>{player.player}</td>
                                <td>{player.played}</td>
                                <td>{player.wins}</td>
                                <td>{player.losses}</td>
                                <td>{player.ballsLeft}</td>
                                <b><td>{player.points}</td></b>
                            </tr>
                        </tbody>
                    })
                }
            </table>
        </div>


    )
}
