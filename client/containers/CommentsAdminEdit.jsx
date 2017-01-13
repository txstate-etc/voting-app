import React from 'react'
import { connect } from 'react-redux'
import {getIdea} from '../actions/idea-actions'
import {getIdea as getIdeaSelector} from '../selectors/ideaSelectors'
import EditComment from './EditComment.jsx';

//There is probably a better name for this component
class CommentsAdminEdit extends React.Component{

    loadData() {
        this.props.getIdea(this.props.params.idea_id)
    }

    componentWillMount(){
        this.loadData()
    }

    render(){
        return(
            <div>
                <div className="row">
                    <div className="col-sm-2 show-label">Idea Title:</div>
                    <div className="col-sm-10">{this.props.idea.title}</div>
                </div>
                <div className="row top-buffer">
                    <div className="col-sm-2 show-label">Idea Description:</div>
                    <div className="col-sm-10">{this.props.idea.text}</div>
                </div>
                <div className="top-buffer comment-list">
                    <ul className="media-list">
                        {
                            this.props.idea.comments.map(comment => {
                                return(
                                    <EditComment comment={comment} key={comment.id} />
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
     var idea_id = ownProps.params.idea_id;
  return {
    idea: getIdeaSelector(state, {idea_id: idea_id}),
  }
}

export default connect(mapStateToProps, {
  getIdea
})(CommentsAdminEdit)