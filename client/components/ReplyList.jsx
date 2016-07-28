import React from 'react';
import Reply from './Reply.jsx'

class ReplyList extends React.Component {
    render(){
        return(
            <div>
                {this.props.replies.map(reply => {
                    return (
                        <Reply
                            key = {reply.id}
                            reply = {reply}
                        />
                    )
                })}
            </div>
        );
    }
}

export default ReplyList;