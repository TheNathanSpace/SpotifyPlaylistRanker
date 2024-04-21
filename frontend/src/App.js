import StartPage from "./StartPage";
import {Route, Switch} from "wouter";
import PlaylistPage from "./PlaylistPage";
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
                        <Route path="/playlist">
                            <PlaylistPage/>
                        </Route>
                    </Switch>
                </div>
            </div>
        </>
    );
}

export default App;
