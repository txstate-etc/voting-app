import * as types from '../actions/action-types';
import fetch from 'isomorphic-fetch';
import schema from '../actions/schema';
import {normalize, arrayOf} from 'normalizr';
import {createUrlQuery} from '../util';
import {parseJSON, handleErrors} from '../util'
import {getSearchParameters} from '../selectors/ideaSelectors'

export function receiveIdeas(total_count, results){
    var result = results.result;
    if (!(result instanceof Array)) result = [result];
    return{
        type: types.RECEIVE_IDEAS,
        total: total_count,
        result,
        entities: results.entities
    }
}

export function requestIdea(){
    return{
        type: types.REQUEST_IDEA
    }
}

//export function getIdeas(options){
export function getIdeas(options){
    var count=0;
    return function(dispatch, getState){
        var state = getState();
        var params = getSearchParameters(state);
        var url = "/ideas" + createUrlQuery(params);
        dispatch({type: types.REQUEST_IDEAS});
        return fetch(url, {credentials: 'include'})
        .then(handleErrors)
        .then(response => {
            count = response.headers.get('X-total-count')
            return response;
        })
        .then(parseJSON)
        .then(ideas =>{
            var norm = normalize(ideas, arrayOf(schema.ideaSchema));
            dispatch(receiveIdeas(count,norm))
        })
        .catch(err => {
            dispatch( {type: types.FAILURE_IDEAS, message:"Failed to retrieve ideas."} );
        })        
    }
}

//The view count should be updated when a user views the idea but not when an admin is editing it.
export function getIdea(id, updateViewCount=false){
    var url = "/ideas/" + id;
    return function(dispatch){
        dispatch(requestIdea());
        return fetch(url, {
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include'
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(idea => {
            
            var norm = normalize(idea, schema.ideaSchema);
            dispatch(receiveIdeas(1,norm))

            if(updateViewCount){
                dispatch({type: types.UPDATE_IDEA_VIEWS_REQUEST})
                var views = idea.views;
                var data = JSON.stringify({views: parseInt(idea.views) + 1})
                return fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    method: 'PUT',
                    body: data
                })
                .then(handleErrors)
                .then(parseJSON)
                .then(idea => {
                    dispatch({type: types.UPDATE_IDEA_VIEWS_SUCCESS, idea})
                })
                .catch(err =>{
                    dispatch({type: types.UPDATE_IDEA_VIEWS_FAILURE, message: 'Failed to update idea'})
                })
            }
        })
        .catch(err => {
            dispatch( {type: types.FAILURE_IDEAS, message:"Failed to retrieve idea."} );
        })
    }
}
