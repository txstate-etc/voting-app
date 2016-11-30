import React from 'react';
var moment = require('moment');
import { Link } from 'react-router';
import $ from 'jquery';
import EditReplies from './EditReplies.jsx';

class EditComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           repliesOpen: false,
           editMode: false,
           value: ""
        };
    }

    unFlagComment(id){
        var url = "/comments/" + id;
        var _this = this;
        $.ajax({
            url: url,
            method: 'PUT',
            dataType: 'json',
            data: {flagged: false},
            success: function(){
                _this.props.updateCommentState(_this.props.comment.id);
            }
        })
    }

    rejectComment(id){
        if(confirm("Are you sure you want to delete this comment?")){
            var url = "/comments/" + id;
            var _this = this;
            $.ajax({
                url: url,
                method: 'DELETE',
                dataType: 'json',
                success: function(){
                    _this.props.removeComment(_this.props.comment.id);
                }
            })
        }
    }

    updateComment(e){
        this.setState({value: e.target.value})
    }

    saveComment(){
        var data = {
            text: this.state.value,
            edited: true
        }
        var url = "/comments/" + this.props.comment.id;
        var _this = this;
        $.ajax({
            url: url,
            method: 'PUT',
            data: data,
            dataType: 'json',
            success: function(comment){
                _this.setState({editMode: false})
                _this.props.updateCommentState(comment.id)
            }
        })
    }

    cancelEdit(){
        this.setState({editMode: false})
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

    toggleEditMode(e){
        var currentState = this.state.editMode;
        this.setState({editMode: !currentState})
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
        if(!this.state.editMode && this.state.repliesOpen){
          replyList  = <EditReplies replies={comment.replies} updateReplyState={this.props.updateReplyState} removeReply={this.props.removeReply}></EditReplies>
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
                                {
                                    !this.state.editMode &&
                                    <div className="admin-buttons">
                                        {comment.flagged && <button onClick={this.unFlagComment.bind(this, comment.id)}><i className="fa fa-flag-o"></i>Unflag</button>}
                                        <button onClick={this.toggleEditMode.bind(this)}><i className="fa fa-edit"></i>Edit</button>
                                        <button onClick={this.rejectComment.bind(this, comment.id)}><i className="fa fa-ban"></i>Reject</button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    {
                        this.state.editMode ?
                            <form onSubmit={this.saveComment.bind(this)}>
                                <textarea autoFocus={true} className="edit-comment" defaultValue={comment.text} onChange={this.updateComment.bind(this)} aria-label="Edit Comment"></textarea>
                                <div className="edit-buttons pull-right">
                                    <button aria-label="save changes to comment" type="submit" className="btn btn-sm btn-warning">Save Changes</button>
                                    <button aria-label="cancel changes to comment" className="btn btn-sm btn-warning">Cancel</button>
                                </div>
                            </form>
                            :
                            <p>{comment.text}</p>
                    }
                    
                    {
                        !this.state.editMode &&
                        <div className="pull-right reply-actions">
                            {this.hasFlaggedReplies(comment.replies) && <span className="flagged-reply"><i className="fa fa-flag" aria-label="Flagged replies"></i></span>}
                            {comment.replies.length >0 && replyLink}
                        </div>
                    }
                    {replyList}
                </div>
            </li>
        );
    }
}

export default EditComment;