import React from 'react'
import Match from './Match'

export default function MatchList({ list, matchesPath, scoresList, scoresPath, update }) {
    if (Object.keys(list).length == 0) {
        return (
            <div className='noResults'>
            Loading matches...
        </div>
        )
    }

    return (
        <div className='matchList'>
            {
                list.map((match, i) => {
                    if (match.player1 !== "") {
                        if (list[i].type === "semifinal" && list[i - 1].type === "group") {
                            return <>
                                <div className='matchType'>
                                    Semifinále
                                </div>
                                <Match
                                    key={i}
                                    index={match.index}
                                    player1={match.player1}
                                    player2={match.player2}
                                    type={match.type}
                                    winner={match.winner}
                                    matchId={match.id}
                                    matchesPath={matchesPath}
                                    scoresList={scoresList}
                                    scoresPath={scoresPath}
                                    update={update}
                                />
                            </>
                        } else if (list[i].type === "final") {
                            return <>
                                <div className='matchType'>
                                    Finále
                                </div>
                                <Match
                                    key={i}
                                    index={match.index}
                                    player1={match.player1}
                                    player2={match.player2}
                                    type={match.type}
                                    winner={match.winner}
                                    matchId={match.id}
                                    matchesPath={matchesPath}
                                    scoresList={scoresList}
                                    scoresPath={scoresPath}
                                    update={update}
                                />
                            </>
                        } else {
                            return <Match
                                key={i}
                                index={match.index}
                                player1={match.player1}
                                player2={match.player2}
                                type={match.type}
                                winner={match.winner}
                                matchId={match.id}
                                matchesPath={matchesPath}
                                scoresList={scoresList}
                                scoresPath={scoresPath}
                                update={update}
                            />
                        }

                    }

                })
            }
        </div>

    )
}
