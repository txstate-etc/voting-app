import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import {browserHistory, Link} from 'react-router'
import { getIdea } from '../actions/idea-actions'
import {getIdea as getIdeaSelector, getVoteTotal} from '../selectors/ideaSelectors'
import Linkify from 'react-linkify'
import AttachmentList from '../components/AttachmentList.jsx'
import CommentList from '../containers/CommentList.jsx'
import AddCommentContainer from '../containers/AddCommentContainer.jsx'

class AdminIdeaDetailPage extends React.Component{

    loadData(){
        this.props.getIdea(this.props.params.idea_id)
    }

    componentWillMount(){
        this.loadData();
    }

    goBack(){
        browserHistory.goBack();
    }

    render(){
        var idea = this.props.idea;
        var date = new Date(idea.created_at);
        var creator = idea.user? idea.user.netid : "";
        return(
            <div className="container">
                <div className="row">
                    <div className="col-xs-6">
                        <a onClick={this.goBack.bind(this)}><i className="back-icon fa fa-long-arrow-left"></i></a>
                        <h2 className="view-idea-title"><Linkify>{idea.title}</Linkify></h2>
                    </div>
                    <div className="col-xs-1">
                        <div className="edit-button"><Link to={'/admin/ideas/edit/' + idea.id} className="btn btn-warning">Edit Idea</Link></div>
                    </div>
                </div>
                <div className="idea-category">
                    <span className="category-label">
                        {idea.categories.length == 1? "Category:" : "Categories:"}
                    </span>
                    <span>
                        {
                            idea.categories.map(function(cat, index){
                                var val="";
                                if(index !=0) val += ", ";
                                return val + cat.name;
                            })
                        }
                    </span>
                </div>
                <div>
                    <span className="stage-label">Stage:</span>
                    <span>{idea.stage.name}</span>
                </div>
                <div>
                    <span className="votes-label">Votes:</span>
                    <span>{this.props.voteScore}</span>
                </div>
                <div>
                    <span className="views-label">Views:</span>
                    <span>{idea.views}</span>
                </div>
                <div>
                    <span className="date-label">Date Submitted:</span>
                    <span>{date.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}</span>
                </div>
                <div>
                    <span className="creator-label">Submitted By:</span>
                    <span>{creator}</span>
                </div>
                <div>
                    <span className="description-label">Description:</span>
                    <p><Linkify>{idea.text}</Linkify></p>
                </div>
                {
                    (idea.files.length) > 0 &&
                    <div>
                        <span className="attachments-label">Attachments:</span>
                        <AttachmentList
                            attachments = {idea.files}
                        />
                    </div>
                }

                <div className="comment-list">
                    <CommentList idea_id={idea.id}/>
                </div>
                <AddCommentContainer
                    idea_id = {idea.id}
                />
            </div>

        )
    }
}

const mapStateToProps = (state, ownProps) => {
    var idea_id = ownProps.params.idea_id;
  return {
    idea: getIdeaSelector(state, {idea_id: idea_id}),
    voteScore: getVoteTotal(state, {idea_id: idea_id})
  }
}

export default connect(mapStateToProps, {
  getIdea
})(AdminIdeaDetailPage)