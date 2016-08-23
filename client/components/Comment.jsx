import React from 'react';
import ReplyList from './ReplyList.jsx';
import AddReplyContainer from './AddReplyContainer.jsx';
import {dateToElapsedTime} from '../util'

class Comment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            repliesOpen: false
        };
    }

    toggleReplies(e){
      var currentState = this.state.repliesOpen;
      this.setState({repliesOpen: !currentState})
    }

    getIcon(user_id){
        var userIcon = this.props.iconList.find(icon => {
            return icon.id == user_id;
        }) || {id:0, color: 'color1', icon: 'fa-circle'}; 
        return userIcon;
    }

    render(){
        var comment = this.props.comment;
        var replyText = "Reply";
        if(comment.replies.length == 1){
          replyText = "1 Reply";
        }
        else if(comment.replies.length > 1){
          replyText = comment.replies.length + " replies";
        }
        var replyBlock = "";
        if(this.state.repliesOpen){
          var replyList  = "";
          if(comment.replies.length > 0) replyList = <ReplyList key="replylist" replies={comment.replies} iconList={this.props.iconList} />;
          replyBlock = [replyList,<AddReplyContainer key={comment.id} comment_id={comment.id}/>];
        }

        var timeElapsed = dateToElapsedTime(comment.updated_at);

        var icon = this.getIcon(comment.user_id);

        return(
            <li className="media">
                <div className="media-left">
                  <i className={"avatar fa " + icon.icon + " " + icon.color }></i>
                </div>
                <div className="media-body">
                  <div className="media-heading">
                    <p className="comment-title">Student|Faculty|Staff</p>
                    <span className="comment-age">{timeElapsed}</span>
                  </div>
                  <p>{comment.text}</p>
                  <div className="pull-right">
                    <a className="reply-link" onClick={this.toggleReplies.bind(this)}><i className="fa fa-comment-o"></i> {replyText}</a>
                  </div>
                  {replyBlock}
                </div>
            </li>
        );
    }
}

export default Comment;