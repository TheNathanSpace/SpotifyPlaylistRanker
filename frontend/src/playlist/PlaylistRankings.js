import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {GET_PLAYLIST_TRACKS, RESET_PLAYLIST_RANKINGS} from "../util/addresses";
import RankingsGrid from "./RankingsGrid";
import {Button} from "@mui/joy";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const PlaylistRankings = (props) => {
    const [playlistTracks, setPlaylistTracks] = useState([]);

    const loadPlaylistTracks = async () => {
        const urlParams = {
            playlist_uri: props.playlist_uri,
            token: props.token
        }
        const target = GET_PLAYLIST_TRACKS + "?" + new URLSearchParams(urlParams).toString();
        const response = await (await fetch(target)).json();

        if (response.valid) {
            setPlaylistTracks(response.playlist_tracks.sort(sortTracks));
        }
    };

    // Initial load: get playlist tracks
    useEffect(() => {
        (async () => {
            await loadPlaylistTracks();
        })();
    }, []);

    const sortTracks = (a, b) => {
        if (b.elo === a.elo) {
            return a.track_name.localeCompare(b.track_name)
        }
        return b.elo - a.elo
    }

    const resetRankings = async () => {
        const urlParams = {
            playlist_uri: props.playlist_uri,
            token: props.token
        }
        const target = RESET_PLAYLIST_RANKINGS + "?" + new URLSearchParams(urlParams).toString();
        await fetch(target);
        await loadPlaylistTracks();
    };

    return (
        <div className={"width-80"}>
            <div className={"full-width"}>
                <RankingsGrid playlistTracks={playlistTracks}/>
            </div>
            <div className={"hor-centered reset-rankings-button-margin"}>
                <Button
                    className={"reset-rankings-button"}
                    color="danger"
                    variant="outlined"
                    size="lg"
                    onClick={() => {
                        resetRankings()
                    }}
                >
                    <WarningAmberOutlinedIcon/>&nbsp;&nbsp;Reset track rankings&nbsp;&nbsp;<WarningAmberOutlinedIcon/>
                </Button>
            </div>
        </div>
    );
}

PlaylistRankings.props = {
    playlist_uri: PropTypes.string,
    token: PropTypes.any
}

export default PlaylistRankings;