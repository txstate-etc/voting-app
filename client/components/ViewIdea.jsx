import React from 'react';
import VoteBlockContainer from './VoteBlockContainer.jsx';
import CommentList from './CommentList.jsx';
import AddCommentContainer from './AddCommentContainer.jsx';
import AttachmentList from './AttachmentList.jsx';

class ViewIdea extends React.Component {

    render(){
        var idea = this.props.idea;
        var date = new Date(idea.created_at);
        var viewCountText = (idea.views == 1) ? "1 view" : (idea.views + " views");
        return(
            <div className="container">
                <h2>{idea.title}</h2>
                <span>
                    {date.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})} |
                    <i className="fa fa-eye"></i> {viewCountText} | 
                    <i className="fa fa-comment-o"></i> {this.props.commentCount} comments
                </span>
                <div className="media idea idea-detail">
                    <div className="media-left media-top">
                        <VoteBlockContainer
                            ideaID = {this.props.id}
                            auth = {this.props.auth}
                        />
                    </div>
                    <div className="media-body idea-description">
                        <h4 className="media-heading">{idea.title}</h4>
                        <p>{idea.text}</p>
                    </div>
                </div>
                Attachments
                <AttachmentList
                    attachments = {idea.files}
                />
                <hr/>
                Comments
                <AddCommentContainer
                    ideaID = {this.props.id}
                />
                <div className="comment-list">
                    <CommentList
                        commentList = {idea.comments}
                        iconList = {this.props.iconList}
                    />
                </div>
            </div> 
        );
    }
}

export default ViewIdea;