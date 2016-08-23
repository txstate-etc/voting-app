import React from 'react';
import Reply from './Reply.jsx'

class ReplyList extends React.Component {

    getIcon(user_id){
        var userIcon = this.props.iconList.find(icon => {
            return icon.id == user_id;
        }) || {id:0, color: 'color1', icon: 'fa-circle'}; 
        return userIcon;
    }

    render(){
        return(
            <div>
                {this.props.replies.map(reply => {
                    return (
                        <Reply
                            key = {reply.id}
                            reply = {reply}
                            icon = {this.getIcon(reply.user_id)}
                        />
                    )
                })}
            </div>
        );
    }
}

export default ReplyList;