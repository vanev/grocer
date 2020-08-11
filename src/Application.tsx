import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import NewPage from "./pages/New";
import ListPage from "./pages/List";

const Application = () => (
  <Router>
    <Switch>
      <Redirect exact from="/" to="/new" />
      <Route exact path="/new" component={NewPage} />
      <Route path="/:listId" component={ListPage} />
    </Switch>
  </Router>
);

export default Application;
