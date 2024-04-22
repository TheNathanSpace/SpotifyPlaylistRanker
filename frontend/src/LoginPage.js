import React, {useRef, useState} from 'react';
import {useLocation} from "wouter";
import {Alert, Button, FormControl, FormHelperText, FormLabel, Input, Stack} from "@mui/joy";
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import {useTheme} from "@mui/material";
import {SPOTIFY_PLAYLIST_PATTERN} from "./constants"
import {CHECK_PLAYLIST, LOGIN} from "./addresses";
import PropTypes from "prop-types";


const LoginPage = (props) => {
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

    const playlistURI = useRef();

    const validatePlaylist = async () => {
        /*
            Playlist format:
            https://open.spotify.com/playlist/0iRTHQNxbBajoLLNpywtD5
         */
        const matched = SPOTIFY_PLAYLIST_PATTERN.exec(playlistValue.current);
        if (!matched) {
            return false;
        }
        const matchedURI = matched[1];

        const params = {
            playlist_uri: matchedURI
        }
        const target = CHECK_PLAYLIST + "?" + new URLSearchParams(params).toString();
        const response = await (await fetch(target)).json();
        playlistURI.current = response.playlist_uri

        return response.valid
    }

    const validateLogin = async () => {
        const fieldsFilled = usernameValue.current && passwordValue.current;

        if (!fieldsFilled) {
            return false;
        }

        /*
          TODO: Verify username exists and username/password matches.
         */
        const params = {
            username: usernameValue.current,
            password: passwordValue.current
        }
        const target = LOGIN + "?" + new URLSearchParams(params).toString();
        const response = await (await fetch(target)).json();
        console.log("Login response:", response)
        props.setToken(response.token)

        return response.valid
    }

    const validateInput = async () => {
        /*
            TODO: Placeholder code to skip login
         */
        // const placeholderPlaylistURI = "0Z2vAuYCxFvpkpPs12TDpa";
        // setLocation("/playlist/" + placeholderPlaylistURI);

        /*
         TODO:
            1. Handle input validation
            2. Route to /playlist, injecting with input
            3. Playlist page take input, gets data from back-end, displays it
         */

        // Show errors only after first attempt
        setShowErrors(true);

        // Validate input
        const newPlaylistIsValid = await validatePlaylist();
        const newLoginIsValid = validateLogin();

        // If input is valid, go to playlist page
        if (newPlaylistIsValid && newLoginIsValid) {
            setLocation("/playlist/" + playlistURI.current);
        }

        // Update state, triggering re-render
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

LoginPage.props = {
    setToken: PropTypes.any
}

export default LoginPage;