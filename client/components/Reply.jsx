import React from 'react';
import {dateToElapsedTime} from '../util'

class Reply extends React.Component {
    render(){
        var timeElapsed = dateToElapsedTime(this.props.reply.updated_at)

        return(
            <div className="media">
                <div className="media-left">
                  <i className="fa fa-meh-o comment-icon"></i>
                </div>
                <div className="media-body">
                    <div className="media-heading">
                        <p className="comment-title">Student|Faculty|Staff</p>
                        <span className="comment-age">{timeElapsed}</span>
                    </div>
                    <p>{this.props.reply.text}</p>
                </div>
          </div>
        );
    }
}

export default Reply;