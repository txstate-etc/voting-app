import React from 'react'
import { Route , IndexRedirect} from 'react-router'
import App from './containers/App'
import HomePage from './containers/HomePage.jsx'
import ShowIdeaPage from './containers/ShowIdeaPage.jsx'
import AddIdeaContainer from './containers/AddIdeaContainer'
import ConfirmNewIdea from './components/ConfirmNewIdea.jsx'
import LoginRedirect from './containers/LoginRedirect.jsx'
import AdminPage from './containers/AdminPage.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'
import CategoriesAdmin from './containers/CategoriesAdmin.jsx'
import CategoryForm from './containers/CategoryForm.jsx'
import IdeasAdmin from './containers/IdeasAdmin.jsx'
import EditIdeaContainer from './containers/EditIdeaContainer.jsx'
import StagesAdmin from './containers/StagesAdmin.jsx'
import StageForm from './containers/StageForm.jsx'
import UsersAdmin from './containers/UsersAdmin.jsx'
import UserForm from './containers/UserForm.jsx'
import CommentsAdmin from './containers/CommentsAdmin.jsx'
import CommentsAdminEdit from './containers/CommentsAdminEdit.jsx'
import AdminIdeaDetailPage from './containers/AdminIdeaDetailPage.jsx'


export const getRoutes = (store) => {
    
    const requireAuth = (nextState, replace) => {
        const state = store.getState();
        if(!state.authState.isLoggedIn){
            replace({
               pathname: '/login',
               state: { nextPathname: nextState.location.pathname}
             })
        }
    }

    const requireAdmin = (nextState, replace) => {
        const state = store.getState();
        if(!state.authState.isAdmin){
            replace({
               pathname: '/notfound',
               state: { nextPathname: nextState.location.pathname}
             })
        }
    }

    return (
        <Route component={App}>
            <Route path="/" component={HomePage}/>
            <Route path="/admin" component={AdminPage} onEnter={requireAdmin}>
                <IndexRedirect to="/admin/ideas" />
                <Route path="/admin/categories" component={CategoriesAdmin}/>
                <Route path="/admin/categories/new" component={CategoryForm} editMode={false}/>
                <Route path="/admin/categories/:category_id" component={CategoryForm} editMode={true}/>
                <Route path="/admin/stages" component={StagesAdmin}/>
                <Route path="/admin/stages/new" component={StageForm} editMode={false}/>
                <Route path="/admin/stages/:stage_id" component={StageForm} editMode={true} />
                <Route path="/admin/ideas" component={IdeasAdmin}/>
                <Route path="/admin/ideas/new" component={AddIdeaContainer}/>
                <Route path="/admin/ideas/:idea_id" component={AdminIdeaDetailPage}/>
                <Route path="/admin/ideas/edit/:idea_id" component={EditIdeaContainer}/>
                <Route path="/admin/users" component={UsersAdmin}/>
                <Route path="/admin/users/new" component={UserForm}/>
                <Route path="/admin/users/:user_id" component={UserForm}/>
                <Route path="/admin/comments" component = {CommentsAdmin} />
                <Route path="/admin/comments/edit/:idea_id" component={CommentsAdminEdit}/>
            </Route>
            <Route path="/login" component={LoginRedirect}/>
            <Route path="/new" component={AddIdeaContainer} onEnter={requireAuth}/>
            <Route path="/new/confirm" component={ConfirmNewIdea} onEnter={requireAuth}/>
            <Route path="/view/:idea_id" component={ShowIdeaPage}/>
            <Route path="*" component={NotFoundPage}/>
        </Route>
    )
}

