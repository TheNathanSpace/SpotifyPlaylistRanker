import LoginPage from "./LoginPage";
import {Route, Switch} from "wouter";
import PlaylistInfo from "./PlaylistPage";
import Header from "./Header";
import {useState} from "react";
import CreateAccountPage from "./CreateAccountPage";

function App() {
    const [token, setToken] = useState();

    /*
        If a token does not exist, then force the login page.
        Otherwise, perform normal routing.
     */

    return (
        <>
            <Header/>
            <div className="content">
                <div className={"hor-centered vert-centered"}>
                    {
                        !token ?
                            <Switch>
                                <Route path="/">
                                    <LoginPage setToken={setToken}/>
                                </Route>
                                <Route path="/create-account">
                                    <CreateAccountPage/>
                                </Route>
                            </Switch>
                            : <></>
                    }
                    {
                        token ?
                            <Switch>
                                <Route path="/">
                                    <LoginPage setToken={setToken}/>
                                </Route>
                                <Route path="/playlist/:playlistURI">
                                    <div>
                                        <PlaylistInfo/>
                                        Tracks as ranked by current user
                                    </div>
                                </Route>
                                <Route path="/playlist/:playlistURI/rank">
                                    <div>
                                        <PlaylistInfo/>
                                        Interactive track ranking menu
                                    </div>
                                </Route>
                            </Switch>
                            : <></>
                    }
                </div>
            </div>
        </>
    );
}

export default App;
