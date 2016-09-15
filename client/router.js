import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Layout from './components/Layout.jsx';
import MainContainer from './components/MainContainer.jsx';
import AddIdeaContainer from './components/AddIdeaContainer.jsx';
import EditIdeaContainer from './components/EditIdeaContainer.jsx';
import ViewIdeaContainer from './components/ViewIdeaContainer.jsx';
import AdminContainer from './components/AdminContainer.jsx';
import LoginRedirect from './components/LoginRedirect.jsx';
import ConfirmNewIdea from './components/ConfirmNewIdea.jsx';
import EditStages from './components/EditStages.jsx';
import StageForm from './components/StageForm.jsx';
import EditCategories from './components/EditCategories.jsx';
import CategoryForm from './components/CategoryForm.jsx';
import EditUsers from './components/EditUsers.jsx';
import UserForm from './components/UserForm.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
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
            <Route path="/edit/:ideaId" component={EditIdeaContainer} onEnter={requireAuth}/>
            <Route path="/admin" component={AdminContainer} onEnter={requireAuth}>
                <Route path="/admin/stages" component={EditStages} onEnter={requireAuth}>
                    <Route path="/admin/stages/add" component={StageForm} editMode={false} onEnter={requireAuth}/>
                    <Route path="/admin/stages/:stageId" component={StageForm} editMode={true} onEnter={requireAuth}/>
                </Route>
                <Route path="/admin/categories" component={EditCategories} onEnter={requireAuth}>
                    <Route path="/admin/categories/add" component={CategoryForm} editMode={false} onEnter={requireAuth}/>
                    <Route path="/admin/categories/:categoryId" component={CategoryForm} editMode={true} onEnter={requireAuth}/>
                </Route>
                <Route path="/admin/users" component={EditUsers} onEnter={requireAuth}>
                    <Route path="/admin/users/add" component={UserForm} editMode={false} onEnter={requireAuth}/>
                    <Route path="/admin/users/:userId" component={UserForm} editMode={true} onEnter={requireAuth}/>
                </Route>
            </Route>
            <Route path="/login" component={LoginRedirect}/>
            <Route path="*" component={NotFoundPage}/>
        </Route>
    </Router>
)