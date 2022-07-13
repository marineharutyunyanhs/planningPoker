import React from 'react';

import Game from './components/Game/Game';
import Join from './components/Join/Join';
import AuthorizationDemo from './components/Authorization/AuthorizationDemo';
import CreateSession from './components/CreateSession/CreateSession';
import './App.css';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
    return (
        <Router>
            <Route path="/" exact component={CreateSession} />
            <Route path="/join" component={Join} />
            <Route path="/game" component={Game} />
            <Route path="/authorization" component={AuthorizationDemo} />
        </Router>
    );
};

export default App;
