import React from 'react';
import VoteBlockContainer from './VoteBlockContainer.jsx';
import CommentList from './CommentList.jsx';
import AddCommentContainer from './AddCommentContainer.jsx';
import AttachmentList from './AttachmentList.jsx';
import Linkify from 'react-linkify';

class ShowIdea extends React.Component {

    render(){
        var idea = this.props.idea;
        var date = new Date(idea.created_at);
        var viewCountText = (idea.views == 1) ? "1 view" : (idea.views + " views");
        return(
            <div className="container">
                <h2 className="view-idea-title"><Linkify>{idea.title}</Linkify></h2>{idea.stage && <span className="stage">{idea.stage.name}</span>}
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
                <div className="view-idea-stats">
                    <span>{date.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}</span> |
                    <span><i className="fa fa-eye"></i> {viewCountText}</span> | 
                    <span><i className="fa fa-comment-o"></i> {this.props.commentCount} comments</span>
                </div>
                <div className="media idea idea-detail">
                    <div className="media-left media-top">
                        <VoteBlockContainer
                            ideaID = {this.props.id}
                        />
                    </div>
                    <div className="media-body idea-description">
                        <p><Linkify>{idea.text}</Linkify></p>
                    </div>
                </div>
                {
                    (idea.files.length > 0) &&
                <div>
                    <h5>Attachments</h5>
                    <AttachmentList
                        attachments = {idea.files}
                    />
                </div>
                }
                <hr/>
                <h5>Comments</h5>
                <AddCommentContainer
                    ideaID = {this.props.id}
                    loggedIn = {this.props.loggedIn}
                />
                <div className="comment-list">
                    <CommentList
                        commentList = {idea.comments}
                        iconList = {this.props.iconList}
                        loggedIn = {this.props.loggedIn}
                    />
                </div>
            </div> 
        );
    }
}

export default ShowIdea;