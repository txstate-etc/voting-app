import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import {sumUnapprovedCommentsAndReplies} from '../util';
var moment = require('moment');

class CommentsIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            commentsToDelete: [] 
        };
    }

    componentDidMount(){
        var _this = this;
        $.ajax({url: "/comments?replies=true", dataType: "json", success: function(result){
            _this.setState({comments: result});
        }});
    }

    hasNewReplies(replies){
        var newReplies = false;
        for(var i=0; i<replies.length; i++){
            if(!replies[i].approved){
                newReplies = true;
            }
        }
        return newReplies;
    }

    render(){
        return(
            <div>
                { this.props.children ||
                <div>
                    <h3>Comments</h3>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Comment</th>
                                <th>Idea</th>
                                <th>Author</th>
                                <th>Last Modified</th>
                                <th>Approved?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.comments.map(comment => {
                                    var icon = (comment.approved && !this.hasNewReplies(comment.replies))? <div className="comment-approved text-center"><i className="fa fa-check" aria-label="Approved Comment"></i></div>
                                     : 
                                     <div className="text-center"><span className="new-indicator">NEW</span></div>;
                                    return (
                                        <tr key={comment.id}>
                                            <td>{icon}</td>
                                            <td><a href={"/admin/comments/edit/" + comment.idea.id + "#comment" + comment.id }>{comment.text}</a></td>
                                            <td>{comment.idea.title}</td>
                                            <td>{comment.user.netid}</td>
                                            <td>{moment(comment.updated_at).format('MM/D/YYYY h:mma')}</td>
                                            <td>{comment.approved? "true" : "false"}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                }
            </div>
        )
    }

}

export default CommentsIndex;