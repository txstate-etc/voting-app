import React from 'react';
import {sumCommentsAndReplies} from '../util';
import { Link } from 'react-router'
import Linkify from 'react-linkify';
import VoteBlockContainer from '../containers/VoteBlockContainer.jsx'

class Idea extends React.Component {
    
    render(){
        var idea = this.props.idea;
        var date = new Date(idea.created_at);
        var detailUrl = "/view/" + idea.id;
        var viewCountText = (idea.views == 1) ? "1 view" : (idea.views + " views");
        var numComments = sumCommentsAndReplies(idea.comments);
        var commentCountText = (numComments == 1) ? "1 comment" : (numComments + " comments");
        return(
            <div className="media idea">
                <div className="media-left media-top">
                    <VoteBlockContainer
                        idea_id = {idea.id}
                    />
                </div>
                <div className="media-body idea-description">
                    <h4 className="media-heading"><Link to={"/view/" + idea.id}>{idea.title}</Link></h4>{idea.stage && <span className="stage">{idea.stage.name}</span>}
                    <p><Linkify>{idea.text}</Linkify></p>
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