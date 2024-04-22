import React, {useState} from 'react';
import playlistPlaceholder from "./images/playlist_placeholder.jpg"
import userPlaceholder from "./images/user_placeholder.png"
import {Button, Divider} from "@mui/joy";
import {useLocation} from "wouter";
import {useParams} from "wouter";

const PlaylistPage = () => {
    const [location, setLocation] = useLocation();
    const params = useParams();

    const [mouseInProfile, setMouseInProfile] = useState(false);
    const [mouseInPlaylist, setMouseInPlaylist] = useState(false);

    const playlistURI = params.playlistURI;
    const profileURL = "https://open.spotify.com/user/0iiohbbq3rib2z3jnmd1piqia";

    const playlistName = "ntwicm 4751914 remix";
    const playlistDescription = "EVERY good song that currently exists";
    const profileUsername = "Nathan";

    const openURL = (url) => {
        Object.assign(document.createElement('a'), {
            target: '_blank',
            rel: 'noopener noreferrer',
            href: url,
        }).click();
    }

    const rankPagePattern = /.*playlist\/(.*)\/rank(.*)/
    const isRankPage = () => {
        return rankPagePattern.test(location);
    }

    const toggleRanking = () => {
        if (isRankPage()) {
            setLocation("/playlist/" + playlistURI)
        } else {
            setLocation("/playlist/" + playlistURI + "/rank")
        }
    }

    const getPlaylistURL = () => {
        return "https://open.spotify.com/playlist/" + playlistURI;
    }

    return (
        <div>
            <div className={"vert-centered"}>
                <img className={"playlist-image playlist-info-column clickable"} src={playlistPlaceholder}
                     alt={"Playlist thumbnail"}
                     onClick={() => {
                         openURL(getPlaylistURL())
                     }}
                     onMouseEnter={() => {
                         setMouseInPlaylist(true)
                     }} onMouseLeave={() => {
                    setMouseInPlaylist(false)
                }}
                />
                <div className={"playlist-info-column"}>
                    <h2 className={"clickable playlist-name " + (mouseInPlaylist ? "underlined" : "")}
                        onClick={() => {
                            openURL(getPlaylistURL())
                        }}
                        onMouseEnter={() => {
                            setMouseInPlaylist(true)
                        }}
                        onMouseLeave={() => {
                            setMouseInPlaylist(false)
                        }}
                    >
                        {playlistName}
                    </h2>
                    <div className={"playlist-description"}>"{playlistDescription}"</div>
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
                            <span style={{paddingLeft: "0.4em"}}>{profileUsername}</span>
                        </div>
                    </div>

                </div>
                <div className={"playlist-info-column"}>
                    <Button
                        className={"start-ranking-button"}
                        color="primary"
                        variant="solid"
                        onClick={() => {
                            toggleRanking()
                        }}
                    >
                        { isRankPage() ? <pre>Stop ranking </pre> : "Start ranking!"}
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