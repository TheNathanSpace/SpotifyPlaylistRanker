import React from 'react';
import {useLocation} from "wouter";

const StartPage = () => {
    const [, setLocation] = useLocation();
    const handleStart = () => {
        setLocation("/playlist");
    };

    return (
        <div>
            <h1>Spotify Playlist Ranker</h1>
            <div className={"vert-centered"}>
                <p className={"inline-child"}>Enter playlist URL:</p><input type={"text"}
                                                                            className={"inline-child"}/>
            </div>
            <div className={"vert-centered"}>
                <p className={"inline-child"}>Username:</p><input type={"text"} className={"inline-child"}/>
            </div>
            <div className={"vert-centered"}>
                <p className={"inline-child"}>Passcode:</p><input type={"text"} className={"inline-child"}/>
            </div>
            <div className={"hor-centered"}>
                <div className={"inline-child"}>
                    <button onClick={handleStart}>Start!</button>
                </div>
            </div>
        </div>
    );
}

export default StartPage;