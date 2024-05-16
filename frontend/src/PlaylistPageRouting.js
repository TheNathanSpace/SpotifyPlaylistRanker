import React from 'react';
import {Route, useParams} from "wouter";
import PlaylistInfo from "./PlaylistPage";

const PlaylistPageRouting = () => {
    const params = useParams();

    return (
        <>
            <Route path="/">
                <div>
                    <PlaylistInfo
                        playlist_uri={params.playlist_uri}
                        buttonLabel={"Start ranking!"}
                        buttonTarget={"/playlist/%s/rank"}
                    />
                    Tracks as ranked by current user
                </div>
            </Route>
            <Route path="/rank">
                <div>
                    <PlaylistInfo
                        playlist_uri={params.playlist_uri}
                        buttonLabel={"Stop ranking"}
                        buttonTarget={"/playlist/%s"}
                    />
                    Interactive track ranking menu
                </div>
            </Route>
        </>
    );
}

export default PlaylistPageRouting;