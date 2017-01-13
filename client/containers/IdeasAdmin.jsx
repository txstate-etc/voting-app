import React from 'react'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import {getIdeas} from '../actions/idea-actions'
import AdminIdeaContainer from '../containers/AdminIdeaContainer.jsx'
import * as types from '../actions/action-types';

class IdeasAdmin extends React.Component{

    loadData(){
        // var params = {
        //     comments: true,
        //     votes: true,
        //     files: true,
        //     //offset: (this.state.currentPage <= 1) ? 0 : (10 * (this.state.currentPage -1)),
        //     //limit: ideasPerPage,
        //     stageRequired: false
        // }
        // // if(this.state.currentCategory > 0){
        // //     params.category = this.state.currentCategory;
        // // }
        this.props.getIdeas()
    }

    componentWillMount(){
        this.props.updateSearchParameters({comments: true, votes: true, files: true, stageRequired: false})
        this.loadData()
    }
    render(){
        return(
            <div>
                <h3>Ideas</h3>
                <div className="row idea-table-header">
                    <div className="col-sm-2">
                        Stage
                    </div>
                    <div className="col-sm-2">
                        Category
                    </div>
                    <div className="col-sm-7">
                        Idea
                    </div>
                    <div className="col-sm-1">
                        Delete
                    </div>
                </div>
                {
                    this.props.result.map((id, index) => {
                        return (
                            <AdminIdeaContainer idea_id={id} key={id} index={index}/>
                        )
                    })
                }
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        result: state.ideaState.result
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateSearchParameters: (params) => {
            dispatch({type: types.UPDATE_SEARCH_PARAMS, params})
        },
        updatePage: (newPage) => {
          dispatch({type: types.UPDATE_PAGE, page: newPage})
        }, 
        getIdeas: bindActionCreators(getIdeas, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdeasAdmin)
