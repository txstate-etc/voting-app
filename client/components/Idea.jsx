import React from 'react';
import VoteBlockContainer from './VoteBlockContainer.jsx';

class Idea extends React.Component {
    
    render(){
        var idea = this.props.idea;
        var date = new Date(idea.created_at);
        var detailUrl = "/view/" + idea.id;
        return(
            <div className="media idea">
                <div className="media-left media-top">
                    <VoteBlockContainer
                        ideaID = {idea.id}
                    />
                </div>
                <div className="media-body idea-description">
                    <h4 className="media-heading"><a href={detailUrl}>{idea.title}</a></h4>
                    <p>{idea.text}</p>
                    <span>
                        <i className="fa fa-eye"></i> {idea.views} views | 
                        <a href="#">
                            <i className="fa fa-comment-o"></i> 
                            XXX comments
                        </a> |
                        {date.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}
                    </span>
                </div>
            </div>
        )
    }
}

export default Idea;