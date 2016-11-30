import React from 'react';
var moment = require('moment');
import { Link } from 'react-router';
import $ from 'jquery';
import EditReply from './EditReply.jsx';

class EditReplies extends React.Component {

    render(){
        return(
            <div className="edit-reply-list">
                {
                    this.props.replies.map(reply => {
                        return(
                            <EditReply
                                updateReplyState={this.props.updateReplyState} 
                                removeReply={this.props.removeReply}
                                reply={reply}
                                key={reply.id}
                            />
                        )
                    })
                }
            </div>
        )
    }
}

export default EditReplies;