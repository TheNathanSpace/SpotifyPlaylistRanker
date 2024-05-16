import LoginPage from "./LoginPage";
import {Redirect, Route, Switch, useLocation} from "wouter";
import Header from "./Header";
import {useState} from "react";
import CreateAccountPage from "./CreateAccountPage";
import PlaylistPageRouting from "./PlaylistPageRouting";

function App() {
    const [token, setToken] = useState(null);
    const [accountCreated, setAccountCreated] = useState()

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
                                token !== null
                                    ?
                                    <PlaylistPageRouting/>
                                    :
                                    <Redirect to={"/"}/>
                            }
                        </Route>
                        <Route path="">
                            <Redirect to={"/"}/>
                        </Route>
                    </Switch>
                </div>
            </div>
        </>
    );
}

export default App;
