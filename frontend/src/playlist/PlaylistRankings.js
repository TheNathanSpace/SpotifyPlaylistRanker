import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {GET_PLAYLIST_TRACKS, RESET_PLAYLIST_RANKINGS} from "../util/addresses";
import RankingsGrid from "./RankingsGrid";
import {Alert, Button, Stack} from "@mui/joy";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const PlaylistRankings = (props) => {
    // The list of user ranked tracks, retrieved from back-end
    const [playlistTracks, setPlaylistTracks] = useState([]);

    // Whether we are waiting for tracks to appear on the page
    const [waitingForTracks, setWaitingForTracks] = useState(true);

    // Whether there was an error getting the tracks
    const [errored, setErrored] = useState(false);

    // Whether the user has clicked the reset button once already
    const [tryReset, setTryReset] = useState(false);

    const loadPlaylistTracks = async () => {
        setWaitingForTracks(true);

        const urlParams = {
            playlist_uri: props.playlist_uri,
            token: props.token
        }
        const target = GET_PLAYLIST_TRACKS + "?" + new URLSearchParams(urlParams).toString();
        const response = await (await fetch(target)).json();

        setWaitingForTracks(false);
        if (response.valid) {
            setPlaylistTracks(response.playlist_tracks.sort(sortTracks));
        } else {
            setErrored(true);
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
        if (!tryReset) {
            setTryReset(true);
            return;
        }

        setTryReset(false);

        const urlParams = {
            playlist_uri: props.playlist_uri,
            token: props.token
        }
        const target = RESET_PLAYLIST_RANKINGS + "?" + new URLSearchParams(urlParams).toString();
        await fetch(target);
        await loadPlaylistTracks();
    };

    return (
        <>
            {
                errored && !waitingForTracks && <Alert color="danger" variant="outlined"
                                                    className={"hor-centered ranking-wizard"}><WarningAmberOutlinedIcon/>&nbsp;&nbsp;Error
                    fetching tracks. Maybe reload?
                </Alert>
            }
            {
                !errored && waitingForTracks &&
                <Stack spacing={6} className={"ranking-wizard"}>
                    <h3 className={"hor-centered ranking-wizard"}>Loading tracks...</h3>
                    <div className={"hor-centered"}>(Be patient. For large playlists that we haven't cached yet,
                        this will take a long time as we retrieve the playlist from Spotify.)
                    </div>
                </Stack>
            }

            {
                !errored && !waitingForTracks &&
                <div className={"width-80"}>
                    <div className={"full-width"}><RankingsGrid playlistTracks={playlistTracks}/>
                        <div className={"hor-centered reset-rankings-button-margin"}>
                            <Button
                                className={"reset-rankings-button"}
                                color="danger"
                                variant={!tryReset ? "outlined" : "solid"}
                                size="lg"
                                onClick={() => {
                                    resetRankings()
                                }}
                            >
                                <WarningAmberOutlinedIcon/>&nbsp;&nbsp;{!tryReset ? "Reset track rankings" : "CONFIRM?"}&nbsp;&nbsp;
                                <WarningAmberOutlinedIcon/>
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

PlaylistRankings.props = {
    playlist_uri: PropTypes.string,
    token: PropTypes.any
}

export default PlaylistRankings;