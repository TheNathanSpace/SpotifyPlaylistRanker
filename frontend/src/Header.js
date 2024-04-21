import React from 'react';
import {useTheme} from "@mui/joy";
import logo192 from "./images/logo192.png"
import {useLocation} from "wouter";

const Header = () => {
    const theme = useTheme();
    const [, setLocation] = useLocation();

    const goHome = () => {
        setLocation("/");
    }

    return (
        <div style={{backgroundColor: theme.palette.background.level1}}>
            <div className={"header-clickable vert-centered"} onClick={goHome}>
                <img src={logo192} alt={"Website logo"} className={"header-logo"}/>
                <div className={"header-text"}>Spotify Playlist Ranker</div>
            </div>
        </div>
    );
}

export default Header;