import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Layout from './components/Layout.jsx';
import MainContainer from './components/MainContainer.jsx';
import AddIdeaContainer from './components/AddIdeaContainer.jsx';
import ViewIdeaContainer from './components/ViewIdeaContainer.jsx';
import AdminContainer from './components/AdminContainer.jsx';

export default (
    <Router history={browserHistory}>
        <Route component={Layout}>
            <Route path="/" component={MainContainer}/>
            <Route path="/new" component={AddIdeaContainer}/>
            <Route path="/view/:ideaId" component={ViewIdeaContainer}/>
            <Route path="/admin" component={AdminContainer}/>
        </Route>
    </Router>
)