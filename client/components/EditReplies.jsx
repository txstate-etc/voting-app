import React from 'react';
import { Link } from 'react-router';
import EditReply from '../containers/EditReply.jsx';

class EditReplies extends React.Component {

    render(){
        return(
            <div className="edit-reply-list">
                {
                    this.props.replies.map(reply => {
                        return(
                            <EditReply reply={reply} key={reply.id}/>
                        )
                    })
                }
            </div>
        )
    }
}

export default EditReplies;