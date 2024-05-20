import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {GET_PLAYLIST_TRACKS} from "../util/addresses";

const PlaylistRankings = (props) => {
    const [playlistTracks, setPlaylistTracks] = useState([]);

    // Initial load: get playlist tracks
    useEffect(() => {
        (async () => {
            const urlParams = {
                playlist_uri: props.playlist_uri
            }
            const target = GET_PLAYLIST_TRACKS + "?" + new URLSearchParams(urlParams).toString();
            const response = await (await fetch(target)).json();

            if (response.valid) {
                setPlaylistTracks(response.playlist_tracks);
            }
        })();
    }, []);

    return (
        <div>
            <p>This is where the rankings will appear</p>
            <ul>{playlistTracks.map(track => <li key={track.track_uri}>{track.track_name}</li>)}</ul>
        </div>
    );
}

PlaylistRankings.props = {
    playlist_uri: PropTypes.string
}

export default PlaylistRankings;