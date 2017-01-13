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
           value: ""
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
        this.props.deleteReply(id)
    }

    toggleEditMode(e){
        var currentState = this.state.editMode;
        this.setState({editMode: !currentState})
    }

    render(){
        var reply = this.props.reply
        var icon = (
            reply.flagged ? 
                <div className={"flag" + (reply.flagged ? " on" : "")}><i className="fa fa-flag fa-fw" aria-label="Flagged Reply"></i></div>
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
                                {
                                    !this.state.editMode &&
                                    <div className="admin-buttons">
                                        <div className="admin-buttons">
                                            {reply.flagged && <button onClick={this.unFlagReply.bind(this, reply.id)}><i className="fa fa-flag-o" aria-label="This comment has flagged replies."></i>Unflag</button>}
                                            <button onClick={this.toggleEditMode.bind(this)}><i className="fa fa-edit"></i>Edit</button>
                                            <button onClick={this.rejectReply.bind(this, reply.id)}><i className="fa fa-ban"></i>Reject</button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    {
                        this.state.editMode ?
                            <form onSubmit={this.saveReply.bind(this)}>
                                <textarea autoFocus={true} className="edit-comment" defaultValue={reply.text} onChange={this.updateReply.bind(this)} aria-label="Edit Reply"></textarea>
                                <div className="edit-buttons pull-right">
                                    <button aria-label="save changes to reply" type="submit" className="btn btn-sm btn-warning">Save Changes</button>
                                    <button aria-label="cancel changes to reply" className="btn btn-sm btn-warning" onClick={this.cancelEdit.bind(this)}>Cancel</button>
                                </div>
                            </form>
                            :
                            <p>{reply.text}</p>
                    }
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