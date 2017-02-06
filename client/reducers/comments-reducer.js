import * as types from '../actions/action-types';

const initialState = {
  flagged_comments: [],
  rejected_comments: [],
  total_rejected: 0,
  loading: false,
  errorMessage: ""
};

const commentReducer = function(state = initialState, action){
    switch(action.type){
        case types.REQUEST_FLAGGED_COMMENTS:
            return Object.assign({}, state, {loading: true})
        case types.RECEIVE_FLAGGED_COMMENTS:
            return Object.assign({}, state, {flagged_comments: action.comments, loading: false})
        case types.UPDATE_COMMENT_SUCCESS:
            //this is short for var edited = action.comment.edited, flagged = action.comment.flagged 
            var {edited, flagged, text} = action.comment
            var updatedComments = state.flagged_comments.map(comment =>{
                if(comment.id == action.comment.id){
                    return Object.assign({}, comment, {edited, flagged, text})
                }
                return comment
            })
            return Object.assign({}, state, {flagged_comments: updatedComments})
        case types.DELETE_COMMENT_SUCCESS:
            var updatedComments = state.flagged_comments.filter(comment =>{
                if(comment.id != action.comment.id){
                    return comment;
                }
            })
            return Object.assign({}, state, {flagged_comments: updatedComments})
        case types.REQUEST_REJECTED_COMMENTS:
            return Object.assign({}, state, {loading: true})
        case types.RECEIVE_REJECTED_COMMENTS:
            return Object.assign({}, state, {rejected_comments: action.comments, loading: false, total_rejected: action.count})
        default:
            return state
    }
    return state;
}

export default commentReducer;