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

export function deleteComment(comment_id, note){
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
            //save the note
            var data = JSON.stringify({
                text: note,
                owner_type: 'comment',
                owner_id: comment.id
            });
            return fetch("/notes", {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: data
            })
            .then(handleErrors)
            .then(parseJSON)
            .then(note => {
                dispatch({type: types.DELETE_COMMENT_SUCCESS, comment, note})
            })
            .catch(err => {
                dispatch({type: types.DELETE_COMMENT_FAILURE, message:"Failed to delete comment"})
            })
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

export function deleteReply(reply_id, note){
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
            //save the note
            var data = JSON.stringify({
                text: note,
                owner_type: 'reply',
                owner_id: reply.id
            });
            return fetch("/notes", {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: data
            })
            .then(handleErrors)
            .then(parseJSON)
            .then(note => {
                dispatch({type: types.DELETE_REPLY_SUCCESS, reply, note})
            })
            .catch(err => {
                dispatch({type: types.DELETE_REPLY_FAILURE, message:"Failed to delete reply"})
            })
        })
        .catch(err => {
            dispatch( {type: types.DELETE_REPLY_FAILURE, message:"Failed to delete reply"})
        })
    }
}

export function fetchFlaggedComments(){
    return function(dispatch){
        var url = "/comments?replies=true&flagged=true";
        dispatch({type: types.REQUEST_FLAGGED_COMMENTS});
        return fetch(url, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(comments => {
            dispatch({type: types.RECEIVE_FLAGGED_COMMENTS, comments})
        })
        .catch(err =>{
            dispatch({type: types.FAIL_REQUEST_FLAGGED_COMMENTS, message:"Failed to retrieve comments"})
        })
    }
}

export function fetchRejectedComments(offset, limit, date){
    //this needs to show rejected replies too
    return function(dispatch){
        var count=0;
        var url = "/notes?offset=" + offset + "&limit=" + limit;
        if(date){
            url += "&startdate=" + date;
        }
        dispatch({type: types.REQUEST_REJECTED_COMMENTS});
        return fetch(url, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(handleErrors)
        .then(response => {
            count = response.headers.get('X-total-count')
            return response;
        })
        .then(parseJSON)
        .then(comments => {
            dispatch({type: types.RECEIVE_REJECTED_COMMENTS, comments, count})
        })
        .catch(err => {
            dispatch({type: types.FAIL_REQUEST_REJECTED_COMMENTS, message:"Failed to retrieve comments"})
        })
    }
}
