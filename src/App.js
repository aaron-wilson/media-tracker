import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';
import CounterPage from './components/CounterPage';
import Users from './components/Users';
import MediaTracker from './components/MediaTracker';
import MediaLists from './components/MediaLists';
import MediaList from './components/MediaList';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">React Redux App</NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <NavLink exact activeClassName="active" className="nav-link" to="/">Counter</NavLink>
                <NavLink exact activeClassName="active" className="nav-link" to="/users">Users</NavLink>
                <NavLink exact activeClassName="active" className="nav-link" to="/mediatracker">MediaTracker</NavLink>
                <NavLink exact activeClassName="active" className="nav-link" to="/mediatracker/medialists">Media Lists</NavLink>
              </div>
            </div>
          </div>
        </nav>
        <Switch>
          <Route exact path="/" component={CounterPage} />
          <Route exact path="/users" component={Users} />
          <Route exact path="/mediatracker" component={MediaTracker} />
          <Route exact path="/mediatracker/medialists" component={MediaLists} />
          <Route exact path="/mediatracker/medialists/:mediaListId" component={MediaList} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
