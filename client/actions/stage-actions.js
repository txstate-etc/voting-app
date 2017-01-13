import * as types from '../actions/action-types';
import fetch from 'isomorphic-fetch';
import {parseJSON, handleErrors} from '../util'

export function fetchStages(){
    var url = "/stages";
    return function(dispatch){
        dispatch({type: types.REQUEST_STAGES});
        return fetch(url, {
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include'
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(stages => {
            dispatch({type: types.RECEIVE_STAGES, stages})
        })
        .catch(err => {
            dispatch({type: types.FAILURE_STAGES, message: "Failed to retrieve stages"});
        });
        
    }
}

export function addStage(name){
    return function(dispatch){
        dispatch({type: types.REQUEST_ADD_STAGE})
        var url="/stages";
        var data=JSON.stringify({name})
        return fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            method: 'POST',
            body: data
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(stage => {
            dispatch({type: types.ADD_STAGE_SUCCESS, stage})
        })
        .catch(err => {
            dispatch({type: types.ADD_STAGE_FAILURE, message: "Failed to create new stage"})
        })
    }
}

export function updateStage(id,properties){
    return function(dispatch){
        dispatch({type: types.REQUEST_UPDATE_STAGE})
        var url = "/stages/" + id;
        var data = JSON.stringify(properties)
        return fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            method: 'PUT',
            body: data
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(stage => {
            dispatch({type: types.UPDATE_STAGE_SUCCESS, stage})
        })
        .catch(err => {
            dispatch({type: types.UPDATE_STAGE_FAILURE, message:"Failed to update stage name"})
        })
    }
}

export function deleteStage(stageToDelete, newStageID){
    return function(dispatch){
        dispatch({type: types.REQUEST_DELETE_STAGE})
        var url="/ideas?stage=" + stageToDelete;
        return fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(ideas => {
            var updates = ideas.map(function(idea){
                return {id: idea.id, data: {stage_id: newStageID}};
            })
            return fetch('/ideas/batch', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                method: 'PATCH',
                body: JSON.stringify(updates)
            })
            .then(handleErrors)
            .then(parseJSON)
            .then(result => {
                return fetch('/stages/' + stageToDelete,{
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    method: 'DELETE'
                })
                .then(handleErrors)
                .then(parseJSON)
                .then(result => {
                    dispatch({type: types.DELETE_STAGE_SUCCESS, id: stageToDelete})
                })
                .catch(err => {
                    dispatch({type: types.DELETE_STAGE_FAILURE, message: "Failed to delete stage, please try again." });
                })
            })
            .catch(err => {
                dispatch({type: types.DELETE_STAGE_FAILURE, message: "Failed to update ideas to new stage" });
            })

        })
        .catch(err => {
            dispatch({type: types.DELETE_STAGE_FAILURE, message: "Failed to retrieve ideas in stage to be deleted" });
        })
    }
}