import React from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';
import Layout from './components/Layout.jsx';
import MainContainer from './components/MainContainer.jsx';
import AddIdeaContainer from './components/AddIdeaContainer.jsx';
import EditIdeaContainer from './components/EditIdeaContainer.jsx';
import ViewIdeaContainer from './components/ViewIdeaContainer.jsx';
import AdminContainer from './components/AdminContainer.jsx';
import LoginRedirect from './components/LoginRedirect.jsx';
import ConfirmNewIdea from './components/ConfirmNewIdea.jsx';
import EditIdeas from './components/EditIdeas.jsx';
import EditComments from './components/EditComments.jsx';
import EditStages from './components/EditStages.jsx';
import StageForm from './components/StageForm.jsx';
import EditCategories from './components/EditCategories.jsx';
import CategoryForm from './components/CategoryForm.jsx';
import EditUsers from './components/EditUsers.jsx';
import UserForm from './components/UserForm.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import {isLoggedIn, isAdmin} from './auth';
import $ from 'jquery';

function requireAuth(nextState, replace) {
    if (!isLoggedIn()) {
     replace({
       pathname: '/login',
       state: { nextPathname: nextState.location.pathname }
     })
   }
}

function requireAdmin(nextState, replace) {
    if (!isAdmin()) {
     replace({
       pathname: '/notfound',
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
                <IndexRedirect to="/admin/ideas" />
                <Route path="/admin/ideas" component={EditIdeas} onEnter={requireAdmin}>
                    <Route path="/admin/ideas/add" component={AddIdeaContainer} editMode={false}/>
                    <Route path="/admin/ideas/:ideaId" component={EditIdeaContainer} editMode={true}/>
                </Route>
                <Route path="/admin/comments" component={EditComments} onEnter={requireAdmin}>
                </Route>
                <Route path="/admin/stages" component={EditStages} onEnter={requireAdmin}>
                    <Route path="/admin/stages/add" component={StageForm} editMode={false}/>
                    <Route path="/admin/stages/:stageId" component={StageForm} editMode={true}/>
                </Route>
                <Route path="/admin/categories" component={EditCategories} onEnter={requireAdmin}>
                    <Route path="/admin/categories/add" component={CategoryForm} editMode={false}/>
                    <Route path="/admin/categories/:categoryId" component={CategoryForm} editMode={true}/>
                </Route>
                <Route path="/admin/users" component={EditUsers} onEnter={requireAdmin}>
                    <Route path="/admin/users/add" component={UserForm} editMode={false}/>
                    <Route path="/admin/users/:userId" component={UserForm} editMode={true}/>
                </Route>
            </Route>
            <Route path="/login" component={LoginRedirect}/>
            <Route path="*" component={NotFoundPage}/>
        </Route>
    </Router>
)