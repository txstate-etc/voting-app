import React from 'react';
var moment = require('moment');
import { Link } from 'react-router';

class EditComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           repliesOpen: false
        };
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

    toggleReplies(e){
      var currentState = this.state.repliesOpen;
      this.setState({repliesOpen: !currentState})
    }

    buildReplyList(replies){
        return(
            <div className="edit-reply-list">
            {replies.map(reply => {
                var icon = reply.approved? <div className="approved"><i className="fa fa-check" aria-label="Approved Comment"></i></div>
                 : 
                 <span className="new-indicator">NEW</span>;
               return(
                    <div className="media" key={reply.id}>
                        <div className="media-left">
                            {icon}
                        </div>
                        <div className="media-body">
                            <div className="media-heading">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <p className="comment-title-admin">
                                            <Link to={'/admin/users/' + reply.user.id}>{reply.user.affiliation + " " + reply.user.id}</Link>
                                        </p>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="admin-buttons">
                                            { !reply.approved && <button><i className="fa fa-check"></i>Approve</button>}
                                            <button><i className="fa fa-ban"></i>Reject</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <span className="comment-age">
                                            {moment(reply.updated_at).format('MM/D/YYYY h:mma')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        <p>{reply.text}</p>
                        </div>
                    </div>
                ) 
            })}
            </div>
        );
    }

    render(){
        var comment = this.props.comment;
        var icon = comment.approved? <div className="approved"><i className="fa fa-check" aria-label="Approved Comment"></i></div>
         : 
         <span className="new-indicator">NEW</span>;

        var replyList = "";
        if(this.state.repliesOpen){
          var replyList  = this.buildReplyList(comment.replies);
        }

        return(
            <li className="media" key={comment.id}>
                <a id={"comment" + comment.id}/>
                <div className="media-left">
                    {icon}
                </div>
                <div className="media-body">
                    <div className="media-heading">
                        <div className="row">
                            <div className="col-sm-6">
                                <p className="comment-title-admin">
                                    <Link to={'/admin/users/' + comment.user.id}>{comment.user.affiliation + " " + comment.user.id}</Link>
                                </p>
                            </div>
                            <div className="col-sm-6">
                                <div className="admin-buttons">
                                    { !comment.approved && <button><i className="fa fa-check"></i>Approve</button>}
                                    <button><i className="fa fa-ban"></i>Reject</button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <span className="comment-age">
                                    {moment(comment.updated_at).format('MM/D/YYYY h:mma')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <p>{comment.text}</p>
                    <div className="pull-right reply-actions">
                        {this.hasNewReplies(comment.replies) && <span className="new-indicator">New Reply</span>}
                        {comment.replies.length >0 && <a className="reply-link" onClick={this.toggleReplies.bind(this)}><i className="fa fa-comment-o"></i>Replies</a>}
                    </div>
                    {replyList}
                </div>
            </li>
        );
    }
}

export default EditComment;