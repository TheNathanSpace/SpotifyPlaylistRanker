import LoginPage from "../login/LoginPage";
import {Redirect, Route, Switch} from "wouter";
import Header from "./Header";
import React, {useState} from "react";
import CreateAccountPage from "../login/CreateAccountPage";
import PlaylistInfo from "../playlist/PlaylistPage";
import LowerPlaylistPage from "../playlist/LowerPlaylistPage";
import {Divider} from "@mui/joy";

function App() {
    const [token, setToken] = useState(null);
    const [accountCreated, setAccountCreated] = useState()
    const [isRanking, setIsRanking] = useState(false);

    return (
        <>
            <Header/>
            <div className="content">
                <div className={"hor-centered vert-centered"}>
                    <div className={"width-80 hor-centered vert-centered"}>
                        <Switch>
                            <Route path="/">
                                {/* TODO: If a token exists, only ask for a playlist URL */}
                                <LoginPage token={token} setToken={setToken} accountCreated={accountCreated}/>
                            </Route>
                            <Route path="/create-account">
                                <CreateAccountPage setAccountCreated={setAccountCreated}/>
                            </Route>
                            <Route path="/playlist/:playlist_uri" nest>
                                {
                                    /*
                                        If a token does not exist, then force the login page.
                                        Otherwise, perform normal routing.
                                     */
                                    token
                                        ?
                                        <div className={"full-width"}>
                                            <PlaylistInfo setIsRanking={setIsRanking} token={token}/>
                                            <div className={"divider"}>
                                                <Divider/>
                                            </div>
                                            <LowerPlaylistPage isRanking={isRanking} token={token}/>
                                        </div>
                                        :
                                        <>
                                            <Redirect to={"~/"}/>
                                        </>
                                }
                            </Route>
                            <Route path="/version">
                                0.3
                            </Route>
                            <Route path="">
                                <>
                                    <Redirect to={"~/"}/>
                                </>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
