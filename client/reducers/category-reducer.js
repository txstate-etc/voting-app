import * as types from '../actions/action-types';

const initialState = {
  categories: [],
  loading: false,
  errorMessage: ""
};

const categoryReducer = function(state = initialState, action){
    switch(action.type){
        case types.REQUEST_CATEGORIES:
            return Object.assign({}, state, {loading: true})
        case types.RECEIVE_CATEGORIES:
            return Object.assign({}, state, {categories: action.categories, loading: false})
        case types.ADD_CATEGORY_SUCCESS:
            var updatedCategories = [...state.categories, action.category]
            return Object.assign({}, state, {categories: updatedCategories})
        case types.DELETE_CATEGORY_SUCCESS:
            var categories = state.categories.filter(function(cat){
                return cat.id != action.id
            })
            return Object.assign({}, state, {categories}, {errorMessage: ""})
        case types.DELETE_CATEGORY_FAILURE:
            return Object.assign({}, state, {errorMessage: action.message})
        case types.UPDATE_CATEGORY_SUCCESS:
            var updatedCategories = state.categories.map(function(cat){
                if(cat.id == action.category.id){
                    return action.category
                }
                else return cat
            })
            return Object.assign({}, state, {categories: updatedCategories})
        default:
            return state
    }
    return state;
}

export default categoryReducer;