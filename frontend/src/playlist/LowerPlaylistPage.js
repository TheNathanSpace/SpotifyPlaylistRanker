import React from 'react';
import PropTypes from "prop-types";
import PlaylistRankings from "./PlaylistRankings";
import {useParams} from "wouter";

const LowerPlaylistPage = (props) => {
    const params = useParams();

    return (
        <div className={"hor-centered"}>
            {
                props.isRanking ?
                    <p>Interactive track ranking menu</p>
                    :
                    <PlaylistRankings playlist_uri={params.playlist_uri} token={props.token}/>
            }
        </div>
    );
}

LowerPlaylistPage.props = {
    isRanking: PropTypes.bool,
    token: PropTypes.any
}

export default LowerPlaylistPage;