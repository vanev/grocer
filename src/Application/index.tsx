import "./style.scss";
import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Provider as FirebaseProvider } from "../hooks/useFirebase";
import NewPage from "../pages/New";
import ListPage from "../pages/List";

const firebaseConfig = {
  apiKey: "AIzaSyBNKsR6ZvughEjIwSSjJhFf8Ulio4yGHiY",
  authDomain: "grocer-94e93.firebaseapp.com",
  databaseURL: "https://grocer-94e93.firebaseio.com",
  projectId: "grocer-94e93",
};

const Application = () => {
  return (
    <FirebaseProvider config={firebaseConfig}>
      <Router>
        <Switch>
          <Redirect exact from="/" to="/new" />
          <Route exact path="/new" component={NewPage} />
          <Route path="/:listId" component={ListPage} />
        </Switch>
      </Router>
    </FirebaseProvider>
  );
};

export default Application;
