import React from 'react'
import { connect } from 'react-redux'
var moment = require('moment');
import { Link } from 'react-router';
import {deleteComment, updateComment} from '../actions/comment-actions'
import EditReplies from '../components/EditReplies.jsx'

class EditComment extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
           repliesOpen: false,
           editMode: false,
           rejectMode: false,
           value: "",
           note: ""
        };
    }

    unFlagComment(){
        this.props.updateComment(this.props.comment.id, {flagged:false})
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

    toggleEditMode(e){
        var currentState = this.state.editMode;
        this.setState({editMode: !currentState})
    }

    toggleRejectMode(e){
        var currentState = this.state.rejectMode;
        this.setState({rejectMode: !currentState})
    }

    cancelEdit(){
        this.setState({editMode: false})
        this.setState({rejectMode: false})
    }

    updateNote(e){
        this.setState({note: e.target.value})
    }

    rejectComment(){
        this.props.deleteComment(this.props.comment.id, this.state.note)
        .then(() => {
            this.setState({rejectMode: false})
        })
    }

    toggleReplies(){
        var currentState = this.state.repliesOpen;
        this.setState({repliesOpen: !currentState})
    }

    updateComment(e){
        this.setState({value: e.target.value})
    }

    saveComment(){
        this.props.updateComment(this.props.comment.id, {text: this.state.value, edited:true})
        .then(() => {
            this.setState({editMode: false})
        })
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
          replyList  = <EditReplies replies={comment.replies}></EditReplies>
        }

        var commentDisplayClass="";
        if(comment.recentlyEdited) commentDisplayClass = "recent-edit";
        else if(comment.recentlyRejected) commentDisplayClass = "recent-reject";

        var commentContent = <p className={commentDisplayClass}>{comment.text}</p>
        if(this.state.editMode){
            commentContent = <form onSubmit={this.saveComment.bind(this)}>
                                <textarea autoFocus={true} className="edit-comment" defaultValue={comment.text} onChange={this.updateComment.bind(this)} aria-label="Edit Comment"></textarea>
                                <div className="edit-buttons pull-right">
                                    <button aria-label="save changes to comment" type="submit" className="btn btn-sm btn-warning">Save Changes</button>
                                    <button aria-label="cancel changes to comment" className="btn btn-sm btn-warning" onClick={this.cancelEdit.bind(this)}>Cancel</button>
                                </div>
                            </form>
        }
        else if(this.state.rejectMode){
            commentContent = <form onSubmit={this.rejectComment.bind(this, comment.id)}>
                                <textarea autoFocus={true} className="edit-comment" value={this.state.note} onChange={this.updateNote.bind(this)} aria-label="Add Note Explaining Rejection"></textarea>
                                <div className="edit-buttons pull-right">
                                    <button aria-label="reject comment" type="submit" className="btn btn-sm btn-warning">Reject Comment</button>
                                    <button aria-label="cancel rejection" className="btn btn-sm btn-warning" onClick={this.cancelEdit.bind(this)}>Cancel</button>
                                </div>
                            </form>
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
                                    !comment.recentlyRejected &&
                                    <div className="admin-buttons">
                                        {comment.flagged && <button onClick={this.unFlagComment.bind(this, comment.id)}><i className="fa fa-flag-o"></i>Unflag</button>}
                                        <button onClick={this.toggleEditMode.bind(this)}><i className="fa fa-edit"></i>Edit</button>
                                        <button onClick={this.toggleRejectMode.bind(this)}><i className="fa fa-ban"></i>Reject</button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                   {commentContent}
                    {
                        <div className="pull-right reply-actions">
                            {this.hasFlaggedReplies(comment.replies) && <span className="flagged-reply"><i className="fa fa-flag" aria-label="Flagged replies"></i></span>}
                            {(comment.replies.length >0 && !this.state.editMode && !this.state.rejectMode) && replyLink}
                        </div>
                    }
                    {replyList}
                </div>
            </li>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        
    }
}

export default connect(mapStateToProps, {
    updateComment,
    deleteComment
})(EditComment);