import React, {useRef, useState} from 'react';
import {useLocation} from "wouter";
import {Alert, Button, FormControl, FormHelperText, FormLabel, Input, Stack} from "@mui/joy";
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import {useTheme} from "@mui/material";

const StartPage = () => {
    const [, setLocation] = useLocation();
    const theme = useTheme();

    const [showErrors, setShowErrors] = useState(false)

    const [playlistIsValid, setPlaylistIsValid] = useState(false)
    const [loginIsValid, setLoginIsValid] = useState(false)

    /*
        Get values from text inputs
     */
    const playlistValue = useRef("");
    const usernameValue = useRef("");
    const passwordValue = useRef("");

    const validatePlaylist = () => {
        /*
            Playlist format:
            https://open.spotify.com/playlist/0iRTHQNxbBajoLLNpywtD5
         */
        const pattern = /.*spotify\.com\/playlist\/(.*)/
        return pattern.test(playlistValue.current);
    }
    const validateLogin = () => {
        return (usernameValue.current && passwordValue.current);
    }

    const validateInput = () => {
        /*
         TODO:
            1. Handle input validation
            2. Route to /playlist, injecting with input
            3. Playlist page take input, gets data from back-end, displays it
         */
        setShowErrors(true);
        const newPlaylistIsValid = validatePlaylist();
        const newLoginIsValid = validateLogin();

        if (newPlaylistIsValid && newLoginIsValid) {
            setLocation("/playlist");
        }
        setPlaylistIsValid(newPlaylistIsValid);
        setLoginIsValid(newLoginIsValid);
    };

    return (
        <div>
            <h1 className={"inter-font"}>Spotify Playlist Ranker</h1>
            <Stack spacing={3}>
                <FormControl>
                    <FormLabel>Playlist URL</FormLabel>
                    <Input
                        color="neutral"
                        disabled={false}
                        placeholder="Playlist URL"
                        size="lg"
                        variant="outlined"
                        onChange={(event) => playlistValue.current = event.target.value}
                    />
                    {
                        (playlistIsValid || !showErrors) ? null : (
                            <FormHelperText style={{color: theme.palette.error.main}}>
                                <InfoOutlined/>
                                Please enter valid Spotify playlist URL
                            </FormHelperText>
                        )
                    }
                </FormControl>
                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                        color="neutral"
                        disabled={false}
                        placeholder="Username"
                        size="lg"
                        variant="outlined"
                        onChange={(event) => usernameValue.current = event.target.value}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                        color="neutral"
                        disabled={false}
                        placeholder="Password"
                        size="lg"
                        variant="outlined"
                        onChange={(event) => passwordValue.current = event.target.value}
                    />
                </FormControl>
                <div className={"hor-centered"}>
                    <Button
                        className={"start-button hor-centered"}
                        color="primary"
                        onClick={validateInput}
                        variant="solid"
                    >
                        Start!
                    </Button>
                </div>
            </Stack>
            <div id={"errors"}>
                {
                    (loginIsValid || !showErrors) ? null : (
                        <Alert className={"input-margin"} color="danger" variant="soft" key={"password"}>
                            Invalid login
                        </Alert>
                    )
                }
            </div>
        </div>
    );
}

export default StartPage;