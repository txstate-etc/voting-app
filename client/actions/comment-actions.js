import * as types from '../actions/action-types';
import fetch from 'isomorphic-fetch';
import {parseJSON, handleErrors} from '../util'

export function addComment(idea_id, text, author){
    return function(dispatch){
        dispatch( {type: types.REQUEST_ADD_COMMENT} )
        var url = "/comments";
        var data = JSON.stringify({idea_id, text});
        return fetch(url, {
            credentials: 'include', 
            body: data, 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(result => {
            var comment = result;
            comment.replies = [];
            comment.user = author;
            dispatch({type: types.ADD_COMMENT_SUCCESS, comment})
        })
        .catch(err => {
            dispatch( {type: types.ADD_COMMENT_FAILURE, message: "Failed to add comment"})
        })
    }
}

export function updateComment(comment_id, properties){
    return function(dispatch){
        dispatch( {type: types.REQUEST_UPDATE_COMMENT})
        var url= "/comments/" + comment_id;
        var data = JSON.stringify(properties)
        return fetch(url, {
            credentials: 'include', 
            body: data, 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(comment =>{
            dispatch({type: types.UPDATE_COMMENT_SUCCESS, comment})
        })
        .catch(err => {
            dispatch({type: types.UPDATE_COMMENT_FAILURE, message:"Failed to update comment"})
        })
    }
}

export function deleteComment(comment_id){
    return function(dispatch){
        dispatch({ type: types.REQUEST_DELETE_COMMENT });
        var url = "/comments/" + comment_id;
        return fetch(url, {
            credentials: 'include', 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(comment => {
            dispatch({type: types.DELETE_COMMENT_SUCCESS, comment})
        })
        .catch(err => {
            dispatch({type: types.DELETE_COMMENT_FAILURE, message:"Failed to delete comment"})
        })
    }
}


//replies
export function addReply(comment_id, text, author){
    return function(dispatch){
        dispatch( {type: types.REQUEST_ADD_REPLY} )
        var url = "/replies";
        var data = JSON.stringify({comment_id, text});
        return fetch(url, {
            credentials: 'include', 
            body: data, 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(result =>{
            var reply = result;
            reply.user = author;
            dispatch({type: types.ADD_REPLY_SUCCESS, reply})
        })
        .catch(err => {
            dispatch({type: types.ADD_REPLY_FAILURE, message:"Failed to add reply"});
        })
    }
}

export function updateReply(reply_id, properties){
    return function(dispatch){
        dispatch({type: types.REQUEST_UPDATE_REPLY});
        var url= "/replies/" + reply_id;
        var data = JSON.stringify(properties)
        return fetch(url, {
            credentials: 'include', 
            body: data, 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(reply =>{
            dispatch( {type: types.UPDATE_REPLY_SUCCESS, reply} )
        })
        .catch(err => {
            dispatch({type: types.UPDATE_REPLY_FAILURE, message: "Failed to update reply"})
        })
    }
}

export function deleteReply(reply_id){
    return function(dispatch){
        dispatch( {type: types.REQUEST_DELETE_REPLY} );
        var url = "/replies/" + reply_id;
        return fetch(url, {
            credentials: 'include', 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(reply => {
            dispatch( {type: types.DELETE_REPLY_SUCCESS, reply} )
        })
        .catch(err => {
            dispatch( {type: types.DELETE_REPLY_FAILURE, message:"Failed to delete reply"})
        })
    }
}

export function fetchFlaggedComments(){
    return function(dispatch){
        var url = "/comments?replies=true&flagged=true";
        dispatch({type: types.REQUEST_COMMENTS});
        return fetch(url, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(comments => {
            //DOES THIS NEED TO BE NORMALIZED?
            dispatch({type: types.RECEIVE_COMMENTS, comments})
        })
        .catch(err =>{
            dispatch({type: types.FAIL_REQUEST_COMMENTS, message:"Failed to retrieve comments"})
        })
    }
}
