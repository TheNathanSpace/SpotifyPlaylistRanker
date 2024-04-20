import React, {useState} from 'react';
import {useLocation} from "wouter";
import {Alert, Button, Input} from "@mui/joy";

const StartPage = () => {
    const [, setLocation] = useLocation();
    const [errors, setErrors] = useState()

    const [playlistValue, setPlaylistValue] = useState("")
    const [usernameValue, setUsernameValue] = useState("")
    const [passwordValue, setPasswordValue] = useState("")

    const handleStart = () => {
        /*
         TODO:
            1. Handle input validation
            2. Route to /playlist, injecting with input
            3. Playlist page take input, gets data from back-end, displays it
         */
        const newErrors = [];
        if (!playlistValue) {
            newErrors.push(<Alert className={"input-margin"} color="danger" variant="soft" key={"playlist"}>Please enter
                valid
                Spotify playlist URL</Alert>)
        }
        if (!usernameValue) {
            newErrors.push(<Alert className={"input-margin"} color="danger" variant="soft" key={"username"}>Please enter
                valid
                Username</Alert>)
        }
        if (!passwordValue) {
            newErrors.push(<Alert className={"input-margin"} color="danger" variant="soft" key={"password"}>Invalid
                Password</Alert>)
        }
        if (playlistValue && usernameValue && passwordValue) {
            setLocation("/playlist");
        } else {
            setErrors(newErrors);
        }
    };

    return (<div>
        <h1 className={"inter-font"}>Spotify Playlist Ranker</h1>
        <div id={"inputs"}>
            <Input
                className={"input-margin"}
                color="neutral"
                disabled={false}
                placeholder="Playlist URL"
                size="lg"
                variant="outlined"
                onChange={(event) => setPlaylistValue(event.target.value)}
            />
            <Input
                className={"input-margin"}
                color="neutral"
                disabled={false}
                placeholder="Username"
                size="lg"
                variant="outlined"
                onChange={(event) => setUsernameValue(event.target.value)}
            />
            <Input
                className={"input-margin"}
                color="neutral"
                disabled={false}
                placeholder="Password"
                size="lg"
                variant="outlined"
                onChange={(event) => setPasswordValue(event.target.value)}
            />
        </div>
        <div className={"hor-centered"}>
            <Button
                className={"inline-child"}
                color="primary"
                onClick={handleStart}
                variant="solid"
            >
                Start!
            </Button>
        </div>
        <div id={"errors"}>
            {errors}
        </div>
    </div>);
}

export default StartPage;