import React from 'react';
var moment = require('moment');
import { Link } from 'react-router';
import $ from 'jquery';

class EditComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           repliesOpen: false
        };
    }

    //type can be "reply" or "comment"
    unFlagComment(type, id){
        var url;
        if(type=="comment"){
            url = "/comments/" + id;
        }
        else if(type == "reply"){
            url = "/replies/" + id;
        }
        var _this = this;
        $.ajax({
            url: url,
            method: 'PUT',
            dataType: 'json',
            data: {flagged: false},
            success: function(){
                _this.props.updateComments(_this.props.comment.idea_id);
            }
        })
    }

    rejectComment(type, id){
        var url;
        if(type=="comment"){
            url = "/comments/" + id;
        }
        else if(type == "reply"){
            url = "/replies/" + id;
        }
        $.ajax({
            url: url,
            method: 'DELETE',
            dataType: 'json',
            success: function(){
                console.log(type + " was rejected.")
            }
        })
    }

    hasFlaggedReplies(replies){
        var flaggedReplies = false;
        for(var i=0; i<replies.length; i++){
            if(replies[i].flagged){
                flaggedReplies = true;
            }
        }
        return flaggedReplies;
    }

    toggleReplies(e){
      var currentState = this.state.repliesOpen;
      this.setState({repliesOpen: !currentState})
    }

    buildReplyList(replies){
        return(
            <div className="edit-reply-list">
            {replies.map(reply => {
                var icon = (
                    reply.flagged ? 
                        <div className={"flag" + (reply.flagged ? " on" : "")}><i className="fa fa-flag fa-fw" aria-label="Flagged Comment"></i></div>
                        :
                        <div className="flag"><i className="fa fa-fw"></i></div>
                    )
               return(
                    <div className="media" key={reply.id}>
                        <div className="media-left">
                            {icon}
                        </div>
                        <div className="media-body">
                            <div className="media-heading">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <p className="comment-title-admin">
                                            <Link to={'/admin/users/' + reply.user.id}>{reply.user.affiliation + " " + reply.user.id}</Link>
                                        </p>
                                    </div>
                                    <div className="col-sm-4">
                                        <span className="comment-age">
                                            {moment(reply.updated_at).format('MM/D/YYYY h:mma')}
                                        </span>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="admin-buttons">
                                            <div className="admin-buttons">
                                                {reply.flagged && <button onClick={this.unFlagComment.bind(this, "reply", reply.id)}><i className="fa fa-flag-o" aria-label="This comment has flagged replies."></i>Unflag</button>}
                                                <button><i className="fa fa-edit"></i>Edit</button>
                                                <button onClick={this.rejectComment.bind(this, "reply", reply.id)}><i className="fa fa-ban"></i>Reject</button>
                                            </div>
                                        </div>
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
        var icon = (comment.flagged ? 
                <div className="flag on"><i className="fa fa-flag fa-fw" aria-label="Flagged Comment"></i></div>
                :
                <div className="flag"><i className="fa fa-fw"></i></div>
            )
        var replyList = "";
        var replyLink = <a className="reply-link" onClick={this.toggleReplies.bind(this)}>
                            {this.state.repliesOpen ? "Hide " : "Show "} Replies
                        </a>;
        if(this.state.repliesOpen){
          replyList  = this.buildReplyList(comment.replies);
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
                            <div className="col-sm-4">
                                <p className="comment-title-admin">
                                    <Link to={'/admin/users/' + comment.user.id}>{comment.user.affiliation + " " + comment.user.id}</Link>
                                </p>
                            </div>
                            <div className="col-sm-4">
                                <span className="comment-age">
                                    {moment(comment.updated_at).format('MM/D/YYYY h:mma')}
                                </span>
                            </div>
                            <div className="col-sm-4">
                                <div className="admin-buttons">
                                    {comment.flagged && <button onClick={this.unFlagComment.bind(this, "comment", comment.id)}><i className="fa fa-flag-o"></i>Unflag</button>}
                                    <button><i className="fa fa-edit"></i>Edit</button>
                                    <button onClick={this.rejectComment.bind(this, "comment", comment.id)}><i className="fa fa-ban"></i>Reject</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>{comment.text}</p>
                    <div className="pull-right reply-actions">
                        {this.hasFlaggedReplies(comment.replies) && <span className="flagged-reply"><i className="fa fa-flag" aria-label="Flagged replies"></i></span>}
                        {comment.replies.length >0 && replyLink}
                    </div>
                    {replyList}
                </div>
            </li>
        );
    }
}

export default EditComment;