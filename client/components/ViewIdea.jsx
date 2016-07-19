import React from 'react';
import VoteBlockContainer from './VoteBlockContainer.jsx';
import {testing} from '../IconGenerator';

class ViewIdea extends React.Component {
    
    render(){
        testing();
        var idea = this.props.idea;
        var date = new Date(idea.created_at);
        return(
            <div className="container">
                <h2>{idea.title}</h2>
                <span>
                    {date.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})} |
                    <i className="fa fa-eye"></i> {idea.views} views | 
                    <a href="#"><i className="fa fa-comment-o"></i> XXX comments</a>
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
                    <ul className="media-list">
                        <li className="media">
                            <div className="media-left">
                              <i className="fa fa-meh-o comment-icon"></i>
                            </div>
                            <div className="media-body">
                              <div className="media-heading">
                                <p className="comment-title">Staff</p>
                                <span className="comment-age">3 hours ago</span>
                              </div>
                              <p>This comment is hard-coded, not pulled from the DB</p>
                              <a href="#" className="pull-right">Reply</a>
                            </div>
                        </li>
                        <li className="media">
                            <div className="media-left">
                              <i className="fa fa-meh-o comment-icon"></i>
                            </div>
                            <div className="media-body">
                              <div className="media-heading">
                                <p className="comment-title">Student</p>
                                <span className="comment-age">5 hours ago</span>
                              </div>
                              <p>This comment is hard-coded, not pulled from the DB</p>
                              <a href="#" className="pull-right">Reply</a>
                            </div>
                        </li>
                    </ul>

                </div>
            </div> 
        );
    }
}

export default ViewIdea;