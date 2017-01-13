import * as types from '../actions/action-types';

const initialState = {
  stages: [],
  loading: false,
  errorMessage: ""
};

const stageReducer = function(state = initialState, action){
    switch(action.type){
        case types.REQUEST_STAGES:
            return Object.assign({}, state, {loading: true})
        case types.RECEIVE_STAGES:
            return Object.assign({}, state, {stages: action.stages, loading: false})
        case types.ADD_STAGE_SUCCESS:
            var updatedStages = [...state.stages, action.stage]
            return Object.assign({}, state, {stages: updatedStages})
        case types.DELETE_STAGE_SUCCESS:
            var stages = state.stages.filter(function(stage){
                return stage.id != action.id
            })
            return Object.assign({}, state, {stages}, {errorMessage: ""})
        case types.DELETE_STAGE_FAILURE:
            return Object.assign({}, state, {errorMessage: action.message})
        case types.UPDATE_STAGE_SUCCESS:
            var updatedStages = state.stages.map(function(stage){
                if(stage.id == action.stage.id){
                    return action.stage
                }
                else return stage
            })
            return Object.assign({}, state, {stage: updatedStages})
        default:
            return state
    }
    return state;
}

export default stageReducer;