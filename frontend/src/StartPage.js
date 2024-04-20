import React, {useRef, useState} from 'react';
import {useLocation} from "wouter";
import ValidationError from "./ValidationError";
import TextInput from "./TextInput";

const StartPage = () => {
    const [, setLocation] = useLocation();
    const [errors, setErrors] = useState()

    const playlistValueRef = useRef("");
    const usernameValueRef = useRef("");
    const passwordValueRef = useRef("");


    const handleStart = () => {
        /*
         TODO:
            1. Handle input validation
            2. Route to /playlist, injecting with input
            3. Playlist page take input, gets data from back-end, displays it
         */
        const newErrors = [];
        if (!playlistValueRef.current) {
            newErrors.push(<ValidationError field={"Playlist URL"}
                                            message={"Please enter valid Spotify playlist URL"}
                                            key={"Playlist URL"}/>);
        }
        if (!usernameValueRef.current) {
            newErrors.push(<ValidationError field={"Username"}
                                            message={"Please enter username"}
                                            key={"Username"}/>);

        }
        if (!passwordValueRef.current) {
            newErrors.push(<ValidationError field={"Password"}
                                            message={"Incorrect password"}
                                            key={"Password"}/>);

        }
        if (playlistValueRef.current && usernameValueRef.current && passwordValueRef.current) {
            setLocation("/playlist");
        } else {
            setErrors(newErrors);
        }
    };

    return (<div>
            <h1>Spotify Playlist Ranker</h1>
            <TextInput prompt={"Enter playlist URL:"} valueRef={playlistValueRef}/>
            <TextInput prompt={"Username:"} valueRef={usernameValueRef}/>
            <TextInput prompt={"Password:"} valueRef={passwordValueRef}/>

            <div className={"hor-centered"}>
                <div className={"inline-child"}>
                    <button onClick={handleStart}>Start!</button>
                </div>
            </div>
            {errors}
        </div>
    );
}

export default StartPage;