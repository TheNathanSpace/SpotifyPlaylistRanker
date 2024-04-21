import React, {useState} from 'react';
import playlistPlaceholder from "./images/playlist_placeholder.jpg"
import userPlaceholder from "./images/user_placeholder.png"
import {Button, Divider} from "@mui/joy";

const PlaylistPage = () => {
    const [mouseInProfile, setMouseInProfile] = useState(false);
    const [mouseInPlaylist, setMouseInPlaylist] = useState(false);

    const playlistURL = "https://open.spotify.com/playlist/0Z2vAuYCxFvpkpPs12TDpa?si=2415b2d8ed4a4ab6";
    const profileURL = "https://open.spotify.com/user/0iiohbbq3rib2z3jnmd1piqia?si=911d95c13ab840c9";

    const openURL = (url) => {
        Object.assign(document.createElement('a'), {
            target: '_blank',
            rel: 'noopener noreferrer',
            href: url,
        }).click();
    }

    return (
        <div>
            <div className={"vert-centered"}>
                <img className={"playlist-image playlist-info-column clickable"} src={playlistPlaceholder}
                     alt={"Playlist thumbnail"}
                     onClick={() => {
                         openURL(playlistURL)
                     }}
                     onMouseEnter={() => {setMouseInPlaylist(true)}} onMouseLeave={() => {setMouseInPlaylist(false)}}
                />
                <div className={"playlist-info-column"}>
                    <h2 className={"clickable playlist-name " + (mouseInPlaylist ? "underlined" : "")}
                         onClick={() => {
                             openURL(playlistURL)
                         }}
                         onMouseEnter={() => {
                             setMouseInPlaylist(true)
                         }}
                         onMouseLeave={() => {
                             setMouseInPlaylist(false)
                         }}
                    >
                        ntwicm 4751914 remix
                    </h2>
                    <div className={"playlist-description"}>"EVERY good song that currently exists"</div>
                    <div className={"vert-centered"}>
                        <span style={{paddingRight: "0.8em"}}>by</span>
                        <div className={"clickable vert-centered " + (mouseInProfile ? "underlined" : "")}
                             onClick={() => {
                                 openURL(profileURL)
                             }}
                             onMouseEnter={() => {
                                 setMouseInProfile(true)
                             }}
                             onMouseLeave={() => {
                                 setMouseInProfile(false)
                             }}
                        >
                            <img className={"profile-image"} src={userPlaceholder} alt={"User profile"}/>
                            <span style={{paddingLeft: "0.4em"}}>Username</span>
                        </div>
                    </div>

                </div>
                <div className={"playlist-info-column"}>
                    <Button
                        className={"start-ranking-button"}
                        color="primary"
                        variant="solid"
                    >
                        Start ranking!
                    </Button>
                </div>
            </div>
            <div className={"divider"}>
                <Divider/>
            </div>
        </div>
    );
}

export default PlaylistPage;