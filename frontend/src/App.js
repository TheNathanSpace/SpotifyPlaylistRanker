import LoginPage from "./LoginPage";
import {Redirect, Route, Switch} from "wouter";
import Header from "./Header";
import React, {useEffect, useRef, useState} from "react";
import CreateAccountPage from "./CreateAccountPage";
import PlaylistInfo from "./PlaylistPage";
import LowerPlaylistPage from "./LowerPlaylistPage";

function App() {
    const [token, setToken] = useState(null);
    const [accountCreated, setAccountCreated] = useState()
    const [isRanking, setIsRanking] = useState(false);

    return (
        <>
            <Header/>
            <div className="content">
                {/*<p>Current token: {token}.</p>*/}
                <div className={"hor-centered vert-centered"}>
                    <Switch>
                        <Route path="/">
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
                                    <div>
                                        <PlaylistInfo setIsRanking={setIsRanking}/>
                                        <LowerPlaylistPage isRanking={isRanking}/>
                                    </div>
                                    :
                                    <>
                                        <p>no token. redirecting</p>
                                        <Redirect to={"~/"}/>
                                    </>
                            }
                        </Route>
                        <Route path="">
                            <>
                                <p>no path. redirecting</p>
                                <Redirect to={"~/"}/>
                            </>
                        </Route>
                    </Switch>
                </div>
            </div>
        </>
    );
}

export default App;
