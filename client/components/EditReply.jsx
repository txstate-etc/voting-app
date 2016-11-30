import React from 'react';
var moment = require('moment');
import { Link } from 'react-router';
import $ from 'jquery';

class EditReply extends React.Component {

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

    saveReply(){
        var data = {
            text: this.state.value,
            edited: true
        }
        var url = "/replies/" + this.props.reply.id;
        var _this = this;
        $.ajax({
            url: url,
            method: 'PUT',
            data: data,
            dataType: 'json',
            success: function(reply){
                _this.setState({editMode: false})
                _this.props.updateReplyState(reply.id)
            }
        })
    }

    cancelEdit(){
        this.setState({editMode: false})
    }

    unFlagReply(id){
        var url = "/replies/" + id;
        var _this = this;
        $.ajax({
            url: url,
            method: 'PUT',
            dataType: 'json',
            data: {flagged: false},
            success: function(){
                _this.props.updateReplyState(id);
            }
        })
    }

    rejectReply(id, comment_id){
        if(confirm("Are you sure you want to delete this reply?")){
            var url = "/replies/" + id;
            var _this = this;
            $.ajax({
                url: url,
                method: 'DELETE',
                dataType: 'json',
                success: function(){
                    _this.props.removeReply(id, comment_id);
                }
            })
        }
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
                                            <button onClick={this.rejectReply.bind(this, reply.id, reply.comment_id)}><i className="fa fa-ban"></i>Reject</button>
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
                                <button aria-label="cancel changes to reply" className="btn btn-sm btn-warning">Cancel</button>
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

export default EditReply;