import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import Welcome from './Welcome';
import MediaLists from './MediaLists';
import MediaList from './MediaList';

const App = () => (
  <div>
    <Router>
      <div>
        <header>
          <Link to="/mediatracker" className="logo">
            <h1 className="thin">M</h1>
          </Link>
          <nav>
            <Link to="/mediatracker/medialists">Media Lists</Link>
          </nav>
        </header>
        <Route exact path="/mediatracker" component={Welcome} />
        <Route exact path="/mediatracker/medialists" component={MediaLists} />
        <Route exact path="/mediatracker/medialists/:mediaListId" component={MediaList} />
      </div>
    </Router>
    <a href="/profile">
      <button className="btn btn-info exit-btn">
        Back to Profile
      </button>
    </a>
  </div>
);

export default App;
