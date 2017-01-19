import * as types from '../actions/action-types';
import { combineReducers } from 'redux';

const categories = (state={}, action) => {
  switch(action.type){
    case types.RECEIVE_IDEAS:
      return action.entities.categories || state
    default:
      return state
  }
}

const stages = (state={}, action) => {
  switch(action.type){
    case types.RECEIVE_IDEAS:
      return action.entities.stages || state
    default:
      return state
  }
}

const users = (state={}, action) => {
  switch(action.type){
    case types.RECEIVE_IDEAS:
      return action.entities.users || state
    case types.ADD_COMMENT_SUCCESS:
      if(!state[action.comment.user.id]){
        return {
          ...state,
          [action.comment.user.id] : {
            ...action.comment.user
          }
        }
      }
      return state
    case types.ADD_REPLY_SUCCESS:
      if(!state[action.reply.user.id]){
        return {
          ...state,
          [action.reply.user.id] : {
            ...action.reply.user
          }
        }
      }
      return state
    default:
      return state
  }
}

const votes = (state={}, action) => {
  switch(action.type){
    case types.RECEIVE_IDEAS:
      return action.entities.votes || state
    case types.REQUEST_ADD_VOTE:
      return state
    case types.ADD_VOTE_SUCCESS:
      return {
        ...state,
        [action.vote.id]: {
          ...action.vote
        }
      }
    case types.UPDATE_VOTE_SUCCESS:
      return {
        ...state,
        [action.vote.id]: {
          ...action.vote
        }
      };
    default:
      return state
  }
}

const comments = (state={}, action) => {
  switch(action.type){
    case types.RECEIVE_IDEAS:
      return action.entities.comments || {state}
    case types.RECEIVE_IDEAS:
      return action.entities.comments || {state}
    case types.ADD_COMMENT_SUCCESS:
      return {
        ...state,
        [action.comment.id]: {
          ...action.comment
        }
      }
    case types.UPDATE_COMMENT_SUCCESS:
      var {edited, flagged, text} = action.comment
      return {
        ...state,
        [action.comment.id]: {
          ...state[action.comment.id],
          edited, flagged, text, recentlyEdited: true
        }
      }
    case types.DELETE_COMMENT_SUCCESS:
      var updatedComments = {...state};
      delete updatedComments[action.comment.id]
      return updatedComments
    case types.ADD_REPLY_SUCCESS:
      return {
        ...state,
        [action.reply.comment_id]: {
          ...state[action.reply.comment_id],
          replies: [...state[action.reply.comment_id].replies, action.reply.id]
        }
      }
    case types.DELETE_REPLY_SUCCESS:
      console.log("deleting reply")
      //return state
      var updatedReplies = state[action.reply.comment_id].replies.filter(id => {
         return id != action.reply.id
       })
       return {
         ...state,
         [action.reply.comment_id]: {
           ...state[action.reply.comment_id],
           replies: updatedReplies
         }
       }
    default:
      return state
  }
}

const replies = (state={}, action) => {
  switch(action.type){
    case types.RECEIVE_IDEAS:
      return action.entities.replies || state
    case types.ADD_REPLY_SUCCESS:
      return {
        ...state,
        [action.reply.id]: {
          ...action.reply
        }
      }
    case types.UPDATE_REPLY_SUCCESS:
      return {
        ...state,
        [action.reply.id]: {
          ...action.reply
        }
      }
    default:
      return state
  }
}

const files = (state = {}, action) => {
  switch(action.type){
    case types.RECEIVE_IDEAS:
      return action.entities.files || state
    default:
      return state;
  }
}

const ideas = (state = {}, action) => {
  switch(action.type){
    case types.REQUEST_IDEA:
      return {}
    case types.RECEIVE_IDEAS:
      return action.entities.ideas || state
    case types.ADD_VOTE_SUCCESS:
      return {
        ...state,
        [action.vote.idea_id]: {
          ...state[action.vote.idea_id],
          votes: [...state[action.vote.idea_id].votes, action.vote.id]
        }
      }
    case types.DELETE_VOTE_SUCCESS:
      var votes = state[action.idea_id].votes;
      var index = votes.indexOf(action.vote_id);
      var newVotes = votes;
      if(index > -1)
        newVotes = votes.slice(0,index).concat(votes.slice(index + 1))
      return {
        ...state,
        [action.idea_id]: {
          ...state[action.idea_id],
          votes: newVotes
        }
      }
    case types.ADD_COMMENT_SUCCESS:
      return{
        ...state,
        [action.comment.idea_id]: {
          ...state[action.comment.idea_id],
          comments: [...state[action.comment.idea_id].comments, action.comment.id]
        }
      }
    case types.DELETE_COMMENT_SUCCESS:
      var updatedComments = state[action.comment.idea_id].comments.filter(id => {
        return id != action.comment.id
      })
      return {
        ...state,
        [action.comment.idea_id]: {
          ...state[action.comment.idea_id],
          comments: updatedComments
        }
      }
    case types.UPDATE_IDEA_VIEWS_SUCCESS:
      return {
        ...state,
        [action.idea.id] : {
          ...state[action.idea.id],
          views: action.idea.views
        }
      }
    default:
      return state
  }
}

const entities = combineReducers({
  ideas,
  stages,
  categories,
  users,
  votes,
  comments,
  replies,
  files
})

const result = (state = [], action) => {
  switch(action.type){
    case types.RECEIVE_IDEAS:
      return action.result; 
    default:
      return state
  }
}
const total = (state = 0, action ) => {
  switch(action.type){
    case types.RECEIVE_IDEAS:
      return action.total;
    default:
      return state
  }
}

const ideasLoading = (state = false, action) => {
  switch(action.type){
    case types.REQUEST_IDEA:
      return true;
    case types.RECEIVE_IDEAS:
      return false;
    default:
      return state
  }
}

const pagination = (state = {currentPage: null, ideasPerPage: null}, action) => {
  switch(action.type){
    case types.SET_PAGINATION:
      return {
        currentPage: action.currentPage,
        ideasPerPage: action.ideasPerPage
      }
    case types.UPDATE_PAGE:
      return {
        ...state,
        currentPage: action.page
      }
    default: 
      return state
  }
}

const searchParams = (state = {}, action) => {
  switch(action.type){
    case types.UPDATE_SEARCH_PARAMS:
      return Object.assign({}, state, action.params)
    case types.REMOVE_SEARCH_PARAM:
      var updatedParams = {...state};
      delete updatedParams[action.param]
      return updatedParams
    default:
      return state
  }
}

const reducer = combineReducers({
  entities,
  result,
  total,
  loading: ideasLoading,
  pagination,
  searchParams
})

export default reducer

