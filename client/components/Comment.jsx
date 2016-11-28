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

    openReplyBlock(e){
      console.log("open reply block")
      this.setState({repliesOpen: true})
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
      var replyText = " Replies";
      if(comment.replies.length == 1){
        replyText = " Reply";
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
          <div className="author-icon media-left">
            <i aria-label={"Comment by " + comment.user.affiliation + " " + icon.aria_id} className={"avatar fa " + icon.icon + " " + icon.color }></i>
          </div>
          <div className="media-body">
            <div className="media-heading">
              <span className="comment-title">{comment.user.affiliation}</span>
              <span className="comment-age">{timeElapsed}</span>
            </div>
            <p>{comment.text}</p>
            <span>
            {
              (this.props.loggedIn || comment.replies.length > 0) && <a onClick={this.openReplyBlock.bind(this)} className="reply-link">Reply</a>
            }
            </span>
            <span className="spacer">&middot;</span>
            <span><a className="flag" onClick={this.flagComment.bind(this, comment.id)}>Flag</a></span>
            <div className="toggle-replies">
              {comment.replies.length > 0 && 
              <a onClick={this.toggleReplies.bind(this)}>
                <i className={"replycon fa " + (this.state.repliesOpen ? "fa-angle-up" : "fa-reply fa-rotate-180")}></i>
                {(this.state.repliesOpen ? "Hide " + replyText : comment.replies.length + replyText)}
              </a>
              }
            </div>
            {replyBlock}
          </div>
        </li>
      );
    }
}

export default Comment;