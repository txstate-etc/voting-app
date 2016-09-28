import React from 'react';
import VoteBlockContainer from './VoteBlockContainer.jsx';
import {sumCommentsAndReplies} from '../util';

class Idea extends React.Component {
    
    render(){
        var idea = this.props.idea;
        var date = new Date(idea.created_at);
        var detailUrl = "/view/" + idea.id;

        var numComments = sumCommentsAndReplies(idea.comments);
        var commentCountText = (numComments == 1) ? "1 comment" : (numComments + " comments");
        var viewCountText = (idea.views == 1) ? "1 view" : (idea.views + " views");
        return(
            <div className="media idea">
                <div className="media-left media-top">
                    <VoteBlockContainer
                        ideaID = {idea.id}
                        auth = {this.props.auth}
                    />
                </div>
                <div className="media-body idea-description">
                    <h4 className="media-heading"><a href={detailUrl}>{idea.title}</a></h4>
                    <p>{idea.text}</p>
                    <span className="idea-stats">
                        <i className="fa fa-eye"></i> {viewCountText} | 
                        <a href={detailUrl}>
                            <i className="fa fa-comment-o"></i> 
                            {commentCountText}
                        </a> |
                        <span className="creation-date">{date.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}</span>
                    </span>
                </div>
            </div>
        )
    }
}

export default Idea;