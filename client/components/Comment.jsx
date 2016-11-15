import React from 'react';
import ReplyList from './ReplyList.jsx';
import AddReplyContainer from './AddReplyContainer.jsx';
import {dateToElapsedTime} from '../util';
import $ from 'jquery';

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

    flagComment(id){
      console.log("comment " + id + " flagged")
      $.ajax({
        url: "/comments/" + id,
        dataType: "json",
        type: 'PUT',
        data: {'flagged': true},
        success: function(){
          alert("Thank you for bringing this to our attention.")  
        },
        error: function(xhr, status, err){
            console.log("there was an error")
        }
      })
    }

    getIcon(user_id){
        var userIcon = this.props.iconList.find(icon => {
            return icon.id == user_id;
        }) || {id:0, color: 'color1', icon: 'fa-circle'}; 
        return userIcon;
    }

    render(){
        var comment = this.props.comment;
        var isModeratorComment = (comment.user.affiliation === "moderator");
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
          replyBlock = [replyList,<AddReplyContainer key={comment.id} comment_id={comment.id} loggedIn={this.props.loggedIn} idea_id = {comment.idea_id} updateCommentList = {this.props.updateCommentList}/>];
        }

        var timeElapsed = dateToElapsedTime(comment.updated_at);

        var icon = this.getIcon(comment.user_id);
        if(isModeratorComment){
          icon.icon = "fa-lock";
          icon.color = "";
        }

        return(
            <li className="media">
                <div className="media-left">
                  <i aria-label={"Comment by " + comment.user.affiliation + " " + icon.aria_id} className={"avatar fa " + icon.icon + " " + icon.color }></i>
                </div>
                <div className="media-body">
                  <div className="media-heading">
                    <p className="comment-title">{comment.user.affiliation}</p>
                    <span className="comment-age">{timeElapsed}</span>
                  </div>
                  <p>{comment.text}</p>
                  <span><a className="flag" onClick={this.flagComment.bind(this, comment.id)}><i className="fa fa-flag-o"></i>Flag Comment</a></span>
                  <span className="pull-right">
                  {
                    (this.props.loggedIn || comment.replies.length > 0) && <a className="reply-link" onClick={this.toggleReplies.bind(this)}><i className="fa fa-comment-o"></i> {replyText}</a>
                  }
                  </span>
                  {replyBlock}
                </div>
            </li>
        );
    }
}

export default Comment;