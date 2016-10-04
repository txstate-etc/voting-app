import React from 'react';
import {dateToElapsedTime} from '../util'

class Reply extends React.Component {
    render(){
        var timeElapsed = dateToElapsedTime(this.props.reply.updated_at)

        var icon = this.props.icon;
        if(this.props.reply.user.affiliation === "moderator"){
            icon.icon = "fa-lock";
            icon.color = "";
        }

        return(
            <div className="media">
                <div className="media-left">
                  <i aria-label={"Reply from " + this.props.reply.user.affiliation + " " + icon.aria_id}className={"avatar fa " + icon.icon + " " + icon.color }></i>
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