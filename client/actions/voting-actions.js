import * as types from '../actions/action-types';
import fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router'
import {parseJSON, handleErrors} from '../util'

export function addVote(idea_id, score){
    var url = "/votes"
    return function(dispatch){
        dispatch({type: types.REQUEST_ADD_VOTE});
        var data = JSON.stringify({idea_id: idea_id, score: score})
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
            if(result.created){
                dispatch( {type: types.ADD_VOTE_SUCCESS, vote: result.vote} )
            }
            else{
                dispatch( {type: types.UPDATE_VOTE_SUCCESS, vote: result.vote} )
            }
        })
        .catch(err => {
             dispatch( {type: types.ADD_VOTE_FAILURE, message: "Failed to add vote" } )
        })
    }
}

export function deleteVote(idea_id, user_id){
    return function(dispatch){
        var url = "/votes?idea=" + idea_id + "&user=" + user_id;
        return fetch(url, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(result => {
            if(result.length > 0){
                var vote_id = result[0].id;
                return fetch("/votes/" + vote_id, {
                    credentials: 'include',
                    method: 'DELETE', 
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(handleErrors)
                .then(parseJSON)
                .then( result => {
                    dispatch( {type: types.DELETE_VOTE_SUCCESS, idea_id, vote_id} )
                })
                .catch(err => {
                    var message = "Failed to delete vote";
                    dispatch( {type: types.DELETE_VOTE_FAILURE, message} )
                })
            }
            else{
                return Promise.resolve();
            }
        })
        .catch(err => {
            var message = "Vote for user " + user_id + " for idea " + idea_id + " not found.";
            dispatch( {type: types.DELETE_VOTE_FAILURE, message} )
        })
    }
}