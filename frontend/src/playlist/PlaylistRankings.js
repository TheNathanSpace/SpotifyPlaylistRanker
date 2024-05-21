import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {GET_PLAYLIST_TRACKS} from "../util/addresses";
import RankingsGrid from "./RankingsGrid";

const PlaylistRankings = (props) => {
    const [playlistTracks, setPlaylistTracks] = useState([]);

    // Initial load: get playlist tracks
    useEffect(() => {
        (async () => {
            const urlParams = {
                playlist_uri: props.playlist_uri,
                token: props.token
            }
            const target = GET_PLAYLIST_TRACKS + "?" + new URLSearchParams(urlParams).toString();
            const response = await (await fetch(target)).json();

            if (response.valid) {
                setPlaylistTracks(response.playlist_tracks.sort(sortTracks));
            }
        })();
    }, []);

    const sortTracks = (a, b) => {
        if (b.elo === a.elo) {
            return a.track_name.localeCompare(b.track_name)
        }
        return b.elo - a.elo
    }

    return (
        <div className={"width-80"}>
            <RankingsGrid playlistTracks={playlistTracks}/>
        </div>
    );
}

PlaylistRankings.props = {
    playlist_uri: PropTypes.string,
    token: PropTypes.any
}

export default PlaylistRankings;