import * as types from '../actions/action-types';

const initialState = {
  loading: false,
  isLoggedIn: false,
  isAdmin: false,
  isCommentMod: false,
  isIdeaMod: false,
  netid: '',
  userid: '',
  affiliation: ''
};

const authReducer = function(state = initialState, action){
    switch(action.type){
        case types.REQUEST_LOGIN:
            return Object.assign({}, state, {loading: true})
        case types.LOGIN_SUCCESS:
            return Object.assign({}, state, {loading: false, 
                                            isLoggedIn: true, 
                                            isAdmin: action.admin,
                                            isCommentMod: action.commentMod,
                                            isIdeaMod: action.ideaMod,
                                            netid: action.netid,
                                            userid: action.userid,
                                            affiliation: action.affiliation})
        case types.LOGIN_FAILURE:
            return Object.assign({}, state, {loading: false, isLoggedIn: false, errorMessage: action.message})
        case types.LOGOUT_SUCCESS:
            return Object.assign({}, state, {isLoggedIn: false,
                                             isAdmin: false,
                                             isCommentMod: false,
                                             isIdeaMod: false,
                                             netid: '',
                                             userid: '',
                                             affiliation: ''})
    }
    return state;
}

export default authReducer;