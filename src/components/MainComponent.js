import { React, useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

import { Routes, Route, Navigate, Link } from 'react-router-dom'
import TournamentDetail from "./TournamentDetail";
import RoundDetail from "./RoundDetail";
import Home from "./Home";

export default function MainComponent() {

    return (
        <>
            <Link to={"/billiard-center"} className="link"><Header /></Link>

            <Routes >
                <Route path="/billiard-center" element={<Home />}/>
                <Route path="/tournament-detail/:index/:id" element={<TournamentDetail />} />
                <Route path="/round-detail/:tournamentID/:tournamentIndex/:id/:index" element={<RoundDetail />} />
                <Route path="/" element={<Navigate to="/billiard-center" />}/>
                
            </Routes>

            <Footer/>
        </>
    )
}

