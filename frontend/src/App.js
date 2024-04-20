import StartPage from "./StartPage";
import {Route, Switch} from "wouter";
import PlaylistPage from "./PlaylistPage";

function App() {
    return (<>
        <div className="content">
            <div className={"hor-centered vert-centered"}>
                <div className={"inline-child"}>
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
        </div>
    </>);
}

export default App;
