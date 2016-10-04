import React from 'react';
import {dateToElapsedTime} from '../util'

class Reply extends React.Component {
    render(){
        var timeElapsed = dateToElapsedTime(this.props.reply.updated_at)

        return(
            <div className="media">
                <div className="media-left">
                  <i aria-label={"Reply from user " + this.props.reply.user_id}className={"avatar fa " + this.props.icon.icon + " " + this.props.icon.color }></i>
                </div>
                <div className="media-body">
                    <div className="media-heading">
                        <p className="comment-title">{this.props.reply.user.affiliation}</p>
                        <span className="comment-age">{timeElapsed}</span>
                    </div>
                    <p>{this.props.reply.text}</p>
                </div>
          </div>
        );
    }
}

export default Reply;