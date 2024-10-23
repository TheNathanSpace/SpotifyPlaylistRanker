import React, {useRef, useState} from 'react';
import {useLocation} from "wouter";
import {Button, FormControl, FormHelperText, FormLabel, Input, Stack} from "@mui/joy";
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import {useTheme} from "@mui/material";
import {CREATE_ACCOUNT, VALIDATE_ACCOUNT} from "../util/addresses";
import PropTypes from "prop-types";


const CreateAccountPage = (props) => {
    const [, setLocation] = useLocation();
    const theme = useTheme();

    const [showErrors, setShowErrors] = useState(false)

    const [usernameIsValid, setUsernameIsValid] = useState(false)
    const [passwordIsValid, setPasswordIsValid] = useState(false)

    const [usernameError, setUsernameError] = useState();
    const [passwordError, setPasswordError] = useState();

    /*
        Get values from text inputs
     */
    const usernameValue = useRef("");
    const passwordValue = useRef("");
    const passwordRepeatValue = useRef("");

    const login = async () => {
        setLocation("/")
    }

    const validateAccountLogin = async () => {
        // Check if fields are filled
        if (!usernameValue.current || !passwordValue.current) {
            return {
                username_valid: usernameValue.current,
                password_valid: passwordValue.current,
                username_error: "Enter username.",
                password_error: "Enter password."
            };
        }
        else if (passwordValue.current !== passwordRepeatValue.current) {
            return {
                username_valid: usernameValue.current,
                password_valid: false,
                username_error: "Enter username.",
                password_error: "Passwords do not match."
            };
        }

        // Ask back-end if username is available and password is valid
        const params = {
            username: usernameValue.current,
            password: passwordValue.current
        }
        const target = VALIDATE_ACCOUNT + "?" + new URLSearchParams(params).toString();
        return await (await fetch(target)).json();
    }

    const validateInput = async () => {
        const validateResponse = await validateAccountLogin();

        // If input is valid, create new account
        if (validateResponse.username_valid && validateResponse.password_valid) {
            const params = {
                username: usernameValue.current,
                password: passwordValue.current
            }
            const target = CREATE_ACCOUNT + "?" + new URLSearchParams(params).toString();
            const response = await (await fetch(target)).json();
            props.setAccountCreated(true);
            setLocation("/");
        }
        // Update state, triggering re-render
        setUsernameIsValid(validateResponse.username_valid);
        setPasswordIsValid(validateResponse.password_valid);
        setUsernameError(validateResponse.username_error);
        setPasswordError(validateResponse.password_error);

        // Show errors only after first attempt
        setShowErrors(true);
    };

    return (
        <div>
            <h1 className={"inter-font"}>Spotify Playlist Ranker</h1>
            <Stack spacing={3}>
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
                    {
                        (usernameIsValid || !showErrors) ? null : (
                            <FormHelperText style={{color: theme.palette.error.main}}>
                                <InfoOutlined/>
                                {usernameError}
                            </FormHelperText>
                        )
                    }
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
                    {
                        (passwordIsValid || !showErrors) ? null : (
                            <FormHelperText style={{color: theme.palette.error.main}}>
                                <InfoOutlined/>
                                {passwordError}
                            </FormHelperText>
                        )
                    }
                </FormControl>
                <FormControl>
                    <FormLabel>Enter Password Again</FormLabel>
                    <Input
                        color="neutral"
                        disabled={false}
                        placeholder="Password"
                        size="lg"
                        variant="outlined"
                        type="password"
                        onChange={(event) => passwordRepeatValue.current = event.target.value}
                    />
                    {
                        (passwordIsValid || !showErrors) ? null : (
                            <FormHelperText style={{color: theme.palette.error.main}}>
                                <InfoOutlined/>
                                {passwordError}
                            </FormHelperText>
                        )
                    }
                </FormControl>
                <div className={"hor-centered"}>
                    <Button
                        className={"start-button"}
                        color="primary"
                        onClick={validateInput}
                        variant="solid"
                    >
                        Create Account
                    </Button>
                </div>
                <div className={"hor-centered"}>
                    <Button
                        className={"start-button"}
                        color="primary"
                        onClick={login}
                        variant="outlined"
                    >
                        Login
                    </Button>
                </div>
            </Stack>
        </div>
    );
}

CreateAccountPage.props = {
    setAccountCreated: PropTypes.bool
};

export default CreateAccountPage;