import * as types from '../actions/action-types';
import fetch from 'isomorphic-fetch';
import {parseJSON, handleErrors} from '../util'

export function receiveUsers(results, total){
    if (!(results instanceof Array)) results = [results];
    return{
        type: types.RECEIVE_USERS,
        users: results,
        total
    }
}

export function fetchUsers(page,limit,query){
    var url = "/users";
    
    var offset = (page <= 1) ? 0 : (limit * (page -1))
    url += "?offset=" + offset + "&limit=" + limit
    if(query.length > 0){
        url += "&q=" + query;
    }
    
    return function(dispatch){
        dispatch({type: types.REQUEST_USERS});
        var count;
        return fetch(url, {
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include'
        })
        .then(handleErrors)
        .then(response => {
            count = response.headers.get('X-total-count')
            return response;
        })
        .then(parseJSON)
        .then(users => {
            dispatch(receiveUsers(users, count))
        })
        .catch(err => {
            dispatch({type: types.FAILURE_USERS, message: "Failed to retrieve users"});
        });
        
    }
}

export function fetchUser(id){
    var url = "/users/" + id;
    return function(dispatch){
        dispatch({type: types.REQUEST_USERS});
        return fetch(url, {
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include'
        })
        .then(handleErrors)
        .then(response => {
            return response;
        })
        .then(parseJSON)
        .then(user => {
            dispatch(receiveUsers(user, 1))
        })
        .catch(err => {
            dispatch({type: types.FAILURE_USERS, message: "Failed to retrieve user"});
        });
        
    }
}