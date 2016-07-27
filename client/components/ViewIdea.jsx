import React from 'react';
import VoteBlockContainer from './VoteBlockContainer.jsx';
import {testing} from '../IconGenerator';
import CommentList from './CommentList.jsx';

class ViewIdea extends React.Component {

    render(){
        testing();
        var idea = this.props.idea;
        var date = new Date(idea.created_at);
        console.log("*** " + idea.comments)
        return(
            <div className="container">
                <h2>{idea.title}</h2>
                <span>
                    {date.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})} |
                    <i className="fa fa-eye"></i> {idea.views} views | 
                    <i className="fa fa-comment-o"></i> {this.props.commentCount} comments
                </span>
                <div className="media idea idea-detail">
                    <div className="media-left media-top">
                        <VoteBlockContainer
                            ideaID = {this.props.id}
                        />
                    </div>
                    <div className="media-body idea-description">
                        <h4 className="media-heading">{idea.title}</h4>
                        <p>{idea.text}</p>
                    </div>
                </div>
                <hr/>
                Comments
                <div><textarea rows="5" className="form-control" placeholder="Tell us what you think"></textarea></div>
                <button className="btn btn-warning pull-right">Save Comment</button>
                <div className="comment-list">
                    <CommentList
                        commentList = {idea.comments}
                    />
                </div>
            </div> 
        );
    }
}

export default ViewIdea;