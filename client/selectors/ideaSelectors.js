import { createSelector } from 'reselect'
import {getIcons} from '../IconGenerator'

const getIdeaInputSelector = (state, props) => {
    var idea = {};
    if(state.ideaState.entities.ideas)
        idea = state.ideaState.entities.ideas[props.idea_id];
    return idea;
}

const getStage = (state, props) => {
    var stage = {}
    if(state.ideaState.entities.ideas[props.idea_id]){
        var stage_id = state.ideaState.entities.ideas[props.idea_id].stage;
        stage = state.ideaState.entities.stages[stage_id];
    }    
    return stage
}

const getCategories = (state, props) => {
    var categories = [];
    if(state.ideaState.entities.ideas[props.idea_id]){
        var category_ids = state.ideaState.entities.ideas[props.idea_id].categories;
        for(var i=0; i<category_ids.length; i++){
            categories.push(state.ideaState.entities.categories[category_ids[i]])
        }
    }
    return categories;
}

const getVotes = (state, props) => {
    var votes = [];
    if(state.ideaState.entities.ideas[props.idea_id]){
        var vote_ids = state.ideaState.entities.ideas[props.idea_id].votes;
        for(var i=0; i<vote_ids.length; i++){
            votes.push(state.ideaState.entities.votes[vote_ids[i]])
        }
    }
    return votes;
}

const getComments = (state, props) => {
    var comments = [];
    if(state.ideaState.entities.ideas[props.idea_id]){
        
        var comment_ids = state.ideaState.entities.ideas[props.idea_id].comments;
        for(var i=0; i<comment_ids.length; i++){
            var comment  = Object.assign({}, state.ideaState.entities.comments[comment_ids[i]]);
            var user_id = comment.user_id;
            comment.user = state.ideaState.entities.users[user_id];
            var reply_ids = comment.replies || [];
            comment.replies = [];
            for(var j=0; j<reply_ids.length; j++){
                var reply = Object.assign({}, state.ideaState.entities.replies[reply_ids[j]]);
                var reply_user_id = reply.user_id;
                reply.user = state.ideaState.entities.users[reply_user_id];
                comment.replies.push(reply)
            }
            comments.push(comment)
        }
    }
    
    return comments;
}

const getFiles = (state, props) => {
    var files = [];
    if(state.ideaState.entities.ideas[props.idea_id]){
        var file_ids = state.ideaState.entities.ideas[props.idea_id].files;
        if(!file_ids) return null;
        for(var i=0; i<file_ids.length; i++){
            //ADD USER TO EACH FILE?
            files.push(state.ideaState.entities.files[file_ids[i]])
        }
    }
    return files;
}

const getLoggedInUserId = (state, props) => {
    var id = 0;
    if(state.authState.isLoggedIn){
        id = state.authState.userid;
    }
    return id;
}

//need to add user

export const makeGetIdea = () => {
    return createSelector(
        [getIdeaInputSelector, getStage, getCategories, getVotes, getComments, getFiles],
        (idea, stage, categories, votes, comments, files) => {
            var denormalized_idea = Object.assign({}, idea);
            denormalized_idea.stage = stage;
            denormalized_idea.categories = categories;
            denormalized_idea.votes = votes;
            denormalized_idea.comments = comments;
            if(files)
                denormalized_idea.files = files;
            return denormalized_idea;
        }
    )
}

export const getIdea = createSelector(
    [getIdeaInputSelector, getStage, getCategories, getVotes, getComments, getFiles],
    (idea, stage, categories, votes, comments, files) => {
        var denormalized_idea = Object.assign({}, idea);
        denormalized_idea.stage = stage;
        denormalized_idea.categories = categories;
        denormalized_idea.votes = votes;
        denormalized_idea.comments = comments;
        denormalized_idea.files = files;
        return denormalized_idea;
    }
)

export const getVoteTotal = createSelector(
    [getVotes],
    (votes) => {
        return votes.reduce(function(prev, cur){
            return prev + cur.score;
        },0);
    }
)

export const getUserScore = createSelector(
    [getVotes, getLoggedInUserId],
    (votes, id) => {
        var userScore = 0;
        var user_vote = votes.filter((vote) => vote.user_id === id);
        if(user_vote.length > 0){
            userScore =  user_vote[0].score;
        }
        return userScore;
    }
)

export const getCommentsForIdea = createSelector(
    [getComments],
    (comments) => {
        return comments;
    }
)

export const createCommentIcons = createSelector(
    [getComments],
    (comments) => {
        var uniqueCommenters = [];
        for(var i=0; i<comments.length; i++){
            var comment = comments[i];
            if(uniqueCommenters.indexOf(comment.user_id) == -1){
                uniqueCommenters.push(comment.user_id)
            }
            var replies = comment.replies;
            for(var j=0; j<replies.length; j++){
                var reply = replies[j];
                if(reply && uniqueCommenters.indexOf(reply.user_id) == -1){
                    uniqueCommenters.push(reply.user_id)
                }
            }

        }
        var icons = [];
        if(uniqueCommenters.length > 0)
            var idea_id = comments[0].idea_id;
            icons = getIcons(uniqueCommenters, idea_id);
        return icons;
    }
)

const paginationInputSelector = (state) => {
    return state.ideaState.pagination
}

const searchParamInputSelector = (state) => {
    return state.ideaState.searchParams
}

//this selector combines the search parameters with the pagination values (if they exist)
export const getSearchParameters = createSelector(
    [searchParamInputSelector, paginationInputSelector],
    (searchParams, pagination) => {
        var params = {...searchParams};
        if(pagination.currentPage && pagination.ideasPerPage){
            params.offset = (pagination.currentPage <= 1) ? 0 : (pagination.ideasPerPage * (pagination.currentPage -1))
            params.limit = pagination.ideasPerPage
        }
        return params
    }
)
