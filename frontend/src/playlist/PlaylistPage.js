import React, {useEffect, useState} from 'react';
import greyImage from "../images/grey.png"
import {Divider} from "@mui/joy";
import {useParams} from "wouter";
import {GET_PLAYLIST_DATA} from "../util/addresses";
import PropTypes from "prop-types";
import ToggleRankingButton from "./ToggleRankingButton";

const PlaylistPage = (props) => {
    const params = useParams();

    const [mouseInProfile, setMouseInProfile] = useState(false);
    const [mouseInPlaylist, setMouseInPlaylist] = useState(false);

    const [playlistData, setPlaylistData] = useState({
        playlist_uri: "",
        playlist_name: "",
        playlist_description: "",
        playlist_image: greyImage,
        profile_uri: "",
        profile_username: "",
        profile_image: greyImage
    });

    /*
       Use useEffect hook with no dependencies to fetch playlist data on initial load.
    */
    useEffect(() => {
        // This is so dumb https://stackoverflow.com/a/64079172/7492795
        (async () => {
            const urlParams = {
                playlist_uri: params.playlist_uri
            }
            const target = GET_PLAYLIST_DATA + "?" + new URLSearchParams(urlParams).toString();
            const response = await (await fetch(target)).json();

            /*
                Convert base64 images to blob URLs
             */
            let playlistImage;
            let userImage;
            const playlistURL = `data:image/png;base64,${response.playlist_image}`
            const userURL = `data:image/png;base64,${response.profile_image}`
            const playlistPromise = fetch(playlistURL);
            const userPromise = fetch(userURL);
            await Promise.allSettled([playlistPromise, userPromise]).then(async ([fetchedPlaylist, fetchedUser]) => {
                await Promise.allSettled([fetchedPlaylist.value.blob(), fetchedUser.value.blob()]).then(([playlistBlob, userBlob]) => {
                    playlistImage = URL.createObjectURL(playlistBlob.value);
                    userImage = URL.createObjectURL(userBlob.value);
                });
            });

            setPlaylistData({
                playlist_uri: params.playlist_uri,
                playlist_name: response.playlist_name,
                playlist_description: response.playlist_description,
                playlist_image: playlistImage,
                profile_uri: response.profile_uri,
                profile_username: response.profile_username,
                profile_image: userImage
            })
        })();
    }, []);

    const openURL = (url) => {
        Object.assign(document.createElement('a'), {
            target: '_blank',
            rel: 'noopener noreferrer',
            href: url,
        }).click();
    }

    const getPlaylistURL = () => {
        return "https://open.spotify.com/playlist/" + params.playlist_uri;
    }

    /*
        TODO: Show MUI skeleton while retrieving playlist data
     */

    return (
        <div>
            <div className={"vert-centered"}>
                <img className={"playlist-image playlist-info-column clickable"} src={playlistData.playlist_image}
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
                        {playlistData.playlist_name}
                    </h2>
                    <div className={"playlist-description"}>"{playlistData.playlist_description}"</div>
                    <div className={"vert-centered"}>
                        <span style={{paddingRight: "0.8em"}}>by</span>
                        <div className={"clickable vert-centered " + (mouseInProfile ? "underlined" : "")}
                             onClick={() => {
                                 openURL("https://open.spotify.com/user/" + playlistData.profile_uri)
                             }}
                             onMouseEnter={() => {
                                 setMouseInProfile(true)
                             }}
                             onMouseLeave={() => {
                                 setMouseInProfile(false)
                             }}
                        >
                            <img className={"profile-image"} src={playlistData.profile_image} alt={"User profile"}/>
                            <span style={{paddingLeft: "0.4em"}}>{playlistData.profile_username}</span>
                        </div>
                    </div>

                </div>
                <div className={"playlist-info-column"}>
                    <ToggleRankingButton
                        setIsRanking={props.setIsRanking}
                    />
                </div>
            </div>
            <div className={"divider"}>
                <Divider/>
            </div>
        </div>
    );
}

PlaylistPage.props = {
    setIsRanking: PropTypes.any,
}

export default PlaylistPage;