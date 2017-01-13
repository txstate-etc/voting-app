import * as types from '../actions/action-types';

const initialState = {
  users: [],
  total: 0,
  loading: false,
  errorMessage: ""
};

const userReducer = function(state = initialState, action){
    switch(action.type){
        case types.REQUEST_USERS:
            return Object.assign({}, state, {loading: true})
        case types.RECEIVE_USERS:
            return Object.assign({}, state, {users: action.users, total: action.total, loading: false})
        default:
            return state
    }
    return state;
}

export default userReducer;
