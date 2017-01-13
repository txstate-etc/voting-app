import * as types from '../actions/action-types';
import fetch from 'isomorphic-fetch';

export function requestLogin(){
    return{
        type: types.REQUEST_LOGIN
    }
}

export function receiveLogin(user){
    return{
        type: types.LOGIN_SUCCESS,
        admin: user.admin,
        commentMod: user.commentMod,
        ideaMod: user.ideaMod,
        netid: user.netid,
        userid: user.id,
        affiliation: user.affiliation
    }
}

export function loginFailed(message){
    return {
        type: types.LOGIN_FAILURE,
        message
    }
}

export function receiveLogout(){
    return{
        type: types.LOGOUT_SUCCESS
    }
}

export function loginUser(user){
    return function(dispatch){
        dispatch(receiveLogin(user))
    }
}