import * as types from '../actions/action-types';

const initialState = {
  comments: [],
  loading: false,
  errorMessage: ""
};

const commentReducer = function(state = initialState, action){
    switch(action.type){
        case types.REQUEST_COMMENTS:
            return Object.assign({}, state, {loading: true})
        case types.RECEIVE_COMMENTS:
            return Object.assign({}, state, {comments: action.comments, loading: false})
        case types.UPDATE_COMMENT_SUCCESS:
            //this is short for var edited = action.comment.edited, flagged = action.comment.flagged 
            var {edited, flagged, text} = action.comment
            var updatedComments = state.comments.map(comment =>{
                if(comment.id == action.comment.id){
                    return Object.assign({}, comment, {edited, flagged, text})
                }
                return comment
            })
            return Object.assign({}, state, {comments: updatedComments})
        case types.DELETE_COMMENT_SUCCESS:
            var updatedComments = state.comments.filter(comment =>{
                if(comment.id != action.comment.id){
                    return comment;
                }
            })
            return Object.assign({}, state, {comments: updatedComments})
        default:
            return state
    }
    return state;
}

export default commentReducer;