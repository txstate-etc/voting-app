import { combineReducers } from 'redux';

// Reducers
import { routerReducer as routing } from 'react-router-redux'
import authReducer from './auth-reducer';
import ideaReducer from './idea-reducer';
import categoryReducer from './category-reducer';
import stageReducer from './stage-reducer';
import userReducer from './user-reducer';
import commentsReducer from './comments-reducer';


var reducers = combineReducers({
    authState: authReducer,
    ideaState: ideaReducer,
    categoryState: categoryReducer,
    stageState: stageReducer,
    userState: userReducer,
    commentState: commentsReducer,
    routing
});

export default reducers;