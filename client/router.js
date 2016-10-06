import React from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';
import AuthContainer from './components/AuthContainer.jsx';
import Layout from './components/Layout.jsx';
import HomeContainer from './components/HomeContainer.jsx';
import AddIdeaContainer from './components/AddIdeaContainer.jsx';
import EditIdeaContainer from './components/EditIdeaContainer.jsx';
import ShowIdeaContainer from './components/ShowIdeaContainer.jsx';
import AdminContainer from './components/AdminContainer.jsx';
import LoginRedirect from './components/LoginRedirect.jsx';
import ConfirmNewIdea from './components/ConfirmNewIdea.jsx';
import IdeasIndex from './components/IdeasIndex.jsx';
import CommentsIndex from './components/CommentsIndex.jsx';
import EditComments from './components/EditComments.jsx';
import StagesIndex from './components/StagesIndex.jsx';
import StageForm from './components/StageForm.jsx';
import CategoriesIndex from './components/CategoriesIndex.jsx';
import CategoryForm from './components/CategoryForm.jsx';
import UsersIndex from './components/UsersIndex.jsx';
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
        <Route component={AuthContainer}>
            <Route component={Layout}>
                <Route path="/" component={HomeContainer}/>
                <Route path="/new" component={AddIdeaContainer} onEnter={requireAuth}/>
                <Route path="/new/confirm" component={ConfirmNewIdea}/>
                <Route path="/view/:ideaId" component={ShowIdeaContainer}/>
                <Route path="/edit/:ideaId" component={EditIdeaContainer} onEnter={requireAuth}/>
                <Route path="/admin" component={AdminContainer} onEnter={requireAuth}>
                    <IndexRedirect to="/admin/ideas" />
                    <Route path="/admin/ideas" component={IdeasIndex} onEnter={requireAdmin}>
                        <Route path="/admin/ideas/add" component={AddIdeaContainer} editMode={false}/>
                        <Route path="/admin/ideas/:ideaId" component={EditIdeaContainer} editMode={true}/>
                    </Route>
                    <Route path="/admin/comments" component={CommentsIndex} onEnter={requireAdmin}>
                        <Route path="/admin/comments/edit/:ideaId" component={EditComments}/>
                    </Route>
                    <Route path="/admin/stages" component={StagesIndex} onEnter={requireAdmin}>
                        <Route path="/admin/stages/add" component={StageForm} editMode={false}/>
                        <Route path="/admin/stages/:stageId" component={StageForm} editMode={true}/>
                    </Route>
                    <Route path="/admin/categories" component={CategoriesIndex} onEnter={requireAdmin}>
                        <Route path="/admin/categories/add" component={CategoryForm} editMode={false}/>
                        <Route path="/admin/categories/:categoryId" component={CategoryForm} editMode={true}/>
                    </Route>
                    <Route path="/admin/users" component={UsersIndex} onEnter={requireAdmin}>
                        <Route path="/admin/users/add" component={UserForm} editMode={false}/>
                        <Route path="/admin/users/:userId" component={UserForm} editMode={true}/>
                    </Route>
                </Route>
                <Route path="/login" component={LoginRedirect}/>
                <Route path="*" component={NotFoundPage}/>
            </Route>
        </Route>
    </Router>
)