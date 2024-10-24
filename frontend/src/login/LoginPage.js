import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from "wouter";
import {Alert, Button, FormControl, FormHelperText, FormLabel, Input, Stack} from "@mui/joy";
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import {useTheme} from "@mui/material";
import {SPOTIFY_PLAYLIST_PATTERN} from "../util/util"
import {CHECK_PLAYLIST, LOGIN} from "../util/addresses";
import PropTypes from "prop-types";


const LoginPage = (props) => {
    console.log(process.env)

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

    /*
        When token is updated, redirect to playlist page
     */
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false // toggle flag after first render/mounting
            return;
        }

        // If input is valid, go to playlist page
        if (playlistIsValid && loginIsValid && props.token) {
            setLocation("/playlist/" + playlistURI.current);
        }
    }, [props.token, playlistIsValid, loginIsValid]);

    const validateLogin = async () => {
        const fieldsFilled = usernameValue.current && passwordValue.current;

        if (!fieldsFilled) {
            return false;
        }

        const params = {
            username: usernameValue.current,
            password: passwordValue.current
        }
        const target = LOGIN + "?" + new URLSearchParams(params).toString();
        const response = await (await fetch(target)).json();
        if (response.valid) {
            props.setToken(response.token);
        }
        return response.valid
    }

    const validateInput = async () => {
        // Validate input
        const newPlaylistIsValid = await validatePlaylist();
        const newLoginIsValid = await validateLogin();

        // Update state, triggering re-render
        setPlaylistIsValid(newPlaylistIsValid);
        setLoginIsValid(newLoginIsValid);

        // Show errors only after first attempt
        setShowErrors(true);
    };

    const createAccount = async () => {
        setLocation("/create-account")
    }

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
                        type="password"
                        onChange={(event) => passwordValue.current = event.target.value}
                    />
                </FormControl>
                {
                    (!props.accountCreated) ? null : (
                        <Alert className={"input-margin"} color="primary" variant="soft">
                            Account created! Login now.
                        </Alert>
                    )
                }
                <div className={"hor-centered"}>
                    <Button
                        className={"start-button"}
                        color="primary"
                        onClick={validateInput}
                        variant="solid"
                    >
                        Login
                    </Button>
                </div>
                <div className={"hor-centered"}>
                    <Button
                        className={"start-button"}
                        color="primary"
                        onClick={createAccount}
                        variant="outlined"
                    >
                        Create Account
                    </Button>
                </div>

            </Stack>
            <div id={"errors"}>
                {
                    (loginIsValid || !showErrors) ? null : (
                        <Alert className={"input-margin"} color="danger" variant="soft">
                            Invalid login
                        </Alert>
                    )
                }
            </div>
        </div>
    );
}

LoginPage.props = {
    token: PropTypes.any,
    setToken: PropTypes.any,
    accountCreated: PropTypes.any
}

export default LoginPage;