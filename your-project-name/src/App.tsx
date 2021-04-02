import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import icon from '../assets/icon.svg';
import AppContainer from './components/AppContainer'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={AppContainer} />
      </Switch>
    </Router>
  );
}
