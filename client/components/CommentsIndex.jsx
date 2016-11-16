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
        $.ajax({url: "/comments?replies=true&flagged=true", dataType: "json", success: function(result){
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
                    <h3>Flagged Comments</h3>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Comment</th>
                                <th>Idea</th>
                                <th>Author</th>
                                <th>Last Modified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.comments.map(comment => {
                                    return (
                                        <tr key={comment.id}>
                                            <td><a href={"/admin/comments/edit/" + comment.idea.id + "#comment" + comment.id }>{comment.text}</a></td>
                                            <td>{comment.idea.title}</td>
                                            <td>{comment.user.netid}</td>
                                            <td>{moment(comment.updated_at).format('MM/D/YYYY h:mma')}</td>
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