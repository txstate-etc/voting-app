import React from 'react';

class Comment extends React.Component {
    render(){
        var comment = this.props.comment;
        return(
            <li className="media">
                <div className="media-left">
                  <i className="fa fa-meh-o comment-icon"></i>
                </div>
                <div className="media-body">
                  <div className="media-heading">
                    <p className="comment-title">Student|Faculty|Staff</p>
                    <span className="comment-age">3 hours ago</span>
                  </div>
                  <p>{comment.text}</p>
                  <a href="#" className="pull-right">Reply</a>
                </div>
            </li>
        );
    }
}

export default Comment;