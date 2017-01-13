import * as types from '../actions/action-types'
import fetch from 'isomorphic-fetch'
import {parseJSON, handleErrors} from '../util'

export function fetchCategories(){
    var url = "/categories";
    return function(dispatch){
        dispatch({
            type: types.REQUEST_CATEGORIES
        });
        return fetch(url, {
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include'
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(categories => {
            dispatch({type: types.RECEIVE_CATEGORIES, categories})
        })
        .catch(err => {
            dispatch({type: types.FAILURE_CATEGORIES, message: "Failed to retrieve categories"})
        });
        
    }
}

export function addCategory(name){
    return function(dispatch){
        dispatch({type: types.REQUEST_ADD_CATEGORY})
        var url="/categories";
        var data=JSON.stringify({name})
        return fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: 'POST',
            body: data
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(category => {
            dispatch({type: types.ADD_CATEGORY_SUCCESS, category})
        })
        .catch(err => {
            var message = "Failed to add category: " + name;
            dispatch({type: types.ADD_CATEGORY_FAILURE, message});
        })
    }
}

export function updateCategory(id,properties){
    return function(dispatch){
        dispatch({type: types.REQUEST_UPDATE_CATEGORY})
        var url = "/categories/" + id;
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
        .then(result =>{
            dispatch({type: types.UPDATE_CATEGORY_SUCCESS, category})
        })
        .catch(err => {
            var message = "Failed to update category";
            dispatch({type: types.UPDATE_CATEGORY_FAILURE, message});
        })
    }
}

/*updates sent to ideas/batch should look like this:
[
    {id: 1, data:{category:[1,2,3]}},
    {id: 2, data:{category:[3]}}
]
*/
export function deleteCategory(catToDelete, newCatID){
    return function(dispatch){
        dispatch( {type: types.REQUEST_DELETE_CATEGORY} )
        var url="/ideas?category=" + catToDelete + "&stageRequired=false";
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
                var obj = {id: idea.id, data: {}};
                var newCatFound = false;
                var categories = idea.categories.filter(function(cat){
                    return cat.id != catToDelete
                })
                var catIds = categories.map(function(cat){
                    return cat.id;
                })
                var index = catIds.indexOf(newCatID);
                if(index == -1) catIds.push(newCatID);
                obj.data.category = catIds;
                return obj;
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
                return fetch('/categories/' + catToDelete,{
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
                    dispatch({type: types.DELETE_CATEGORY_SUCCESS, id: catToDelete})
                })
                .catch(err => {
                    dispatch( {type: types.DELETE_CATEGORY_FAILURE, message: "Failed to delete category, please try again."});
                })
            })
            .catch(err => {
                dispatch({ type: types.DELETE_CATEGORY_FAILURE, message: "Failed to update ideas to new category"});
            })

        })
        .catch(err => {
            dispatch({ type: types.DELETE_CATEGORY_FAILURE, message: "Failed to retrieve ideas in category to be deleted"});
        })
    }
}