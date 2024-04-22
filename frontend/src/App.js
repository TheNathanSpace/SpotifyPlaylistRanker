import StartPage from "./StartPage";
import {Route, Switch} from "wouter";
import PlaylistInfo from "./PlaylistPage";
import Header from "./Header";

function App() {
    return (
        <>
            <Header/>
            <div className="content">
                <div className={"hor-centered vert-centered"}>
                    <Switch>
                        <Route path="/">
                            <StartPage/>
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
                </div>
            </div>
        </>
    );
}

export default App;
