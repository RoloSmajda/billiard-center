import React from 'react'

import "../style.css"

export default function Table({ list }) {
    if (Object.keys(list).length == 0) {
        return (
            <div className='noResults'>
            Loading table...
        </div>
        )
    }
    return (
        <div className='tournamentTable'>
            <table>
                <thead>
                    <th>#</th>
                    <th className='tableName'>Hráč</th>
                    <th className='tablePoints'>Body</th>
                    <th className='tableDiff'>+/-</th>
                </thead>
                <tbody>
                    {
                        list.map((player, i) => {
                            return <tr key={i}>
                                <td>
                                    {i + 1}.
                                </td>
                                <td className='tableName'>
                                    {player.name}
                                </td>
                                <td className='tablePoints'>
                                    <b>{player.points}</b>
                                </td>
                                <td className='tableDiff'>
                                    {player.points - list[0].points}
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>

    )
}
