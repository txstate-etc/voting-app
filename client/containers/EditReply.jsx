import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router';
var moment = require('moment');
import {updateReply, deleteReply} from '../actions/comment-actions'

class EditReply extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
           editMode: false,
           rejectMode: false,
           value: "",
           note: ""
        };
    }

    updateReply(e){
        this.setState({value: e.target.value})
    }

    saveReply(e){
        e.preventDefault();
        this.props.updateReply(this.props.reply.id, {text: this.state.value, edited:true})
        .then(() => {
            this.setState({editMode: false})
        })
    }

    cancelEdit(e){
        e.preventDefault();
        this.setState({editMode: false})
    }

    unFlagReply(id){
        this.props.updateReply(id, {flagged:false})
    }

    rejectReply(id){
        this.props.deleteReply(id, this.state.note)
        .then(() => {
            this.setState({rejectMode: false})
        })
    }

    toggleEditMode(e){
        var currentState = this.state.editMode;
        this.setState({editMode: !currentState})
    }

    toggleRejectMode(e){
        var currentState = this.state.rejectMode;
        this.setState({rejectMode: !currentState})
    }

    updateNote(e){
        this.setState({note: e.target.value})
    }

    render(){
        var reply = this.props.reply
        var icon = (
            reply.flagged ? 
                <div className={"flag" + (reply.flagged ? " on" : "")}><i className="fa fa-flag fa-fw" aria-label="Flagged Reply"></i></div>
                :
                <div className="flag"><i className="fa fa-fw"></i></div>
        )

        var commentDisplayClass="";
        if(reply.recentlyEdited) commentDisplayClass = "recent-edit";
        else if(reply.recentlyRejected) commentDisplayClass = "recent-reject";
        var replyContent = <p className={commentDisplayClass}>{reply.text}</p>
        if(this.state.editMode){
            replyContent = <form onSubmit={this.saveReply.bind(this)}>
                                <textarea autoFocus={true} className="edit-comment" defaultValue={reply.text} onChange={this.updateReply.bind(this)} aria-label="Edit Reply"></textarea>
                                <div className="edit-buttons pull-right">
                                    <button aria-label="save changes to reply" type="submit" className="btn btn-sm btn-warning">Save Changes</button>
                                    <button aria-label="cancel changes to reply" className="btn btn-sm btn-warning" onClick={this.cancelEdit.bind(this)}>Cancel</button>
                                </div>
                            </form>
        }
        else if(this.state.rejectMode){
            replyContent = <form onSubmit={this.rejectReply.bind(this, reply.id)}>
                                <textarea autoFocus={true} className="edit-comment" value={this.state.note} onChange={this.updateNote.bind(this)} aria-label="Add Note Explaining Rejection"></textarea>
                                <div className="edit-buttons pull-right">
                                    <button aria-label="reject reply" type="submit" className="btn btn-sm btn-warning">Reject Reply</button>
                                    <button aria-label="cancel rejection" className="btn btn-sm btn-warning" onClick={this.cancelEdit.bind(this)}>Cancel</button>
                                </div>
                            </form>
        }
        //<button onClick={this.rejectReply.bind(this, reply.id)}><i className="fa fa-ban"></i>Reject</button>
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
                                {
                                    (!this.state.editMode && !reply.recentlyRejected) &&
                                        <div className="admin-buttons">
                                            {reply.flagged && <button onClick={this.unFlagReply.bind(this, reply.id)}><i className="fa fa-flag-o" aria-label="This comment has flagged replies."></i>Unflag</button>}
                                            <button onClick={this.toggleEditMode.bind(this)}><i className="fa fa-edit"></i>Edit</button>
                                            <button onClick={this.toggleRejectMode.bind(this)}><i className="fa fa-ban"></i>Reject</button>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                    {replyContent}
                </div>
            </div>  
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        
    }
}

export default connect(mapStateToProps, {
    updateReply,
    deleteReply
})(EditReply);