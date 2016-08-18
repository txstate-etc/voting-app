import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Layout from './components/Layout.jsx';
import MainContainer from './components/MainContainer.jsx';
import AddIdeaContainer from './components/AddIdeaContainer.jsx';
import ViewIdeaContainer from './components/ViewIdeaContainer.jsx';
import AdminContainer from './components/AdminContainer.jsx';
import LoginRedirect from './components/LoginRedirect.jsx';
import ConfirmNewIdea from './components/ConfirmNewIdea.jsx'
import {isLoggedIn} from './auth';
import $ from 'jquery';

function requireAuth(nextState, replace) {
    if (!isLoggedIn()) {
     replace({
       pathname: '/login',
       state: { nextPathname: nextState.location.pathname }
     })
   }
}

export default (
    <Router history={browserHistory}>
        <Route component={Layout}>
            <Route path="/" component={MainContainer}/>
            <Route path="/new" component={AddIdeaContainer} onEnter={requireAuth}/>
            <Route path="/new/confirm" component={ConfirmNewIdea}/>
            <Route path="/view/:ideaId" component={ViewIdeaContainer}/>
            <Route path="/admin" component={AdminContainer} onEnter={requireAuth}/>
            <Route path="/login" component={LoginRedirect}/>
        </Route>
    </Router>
)