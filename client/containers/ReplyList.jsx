import React from 'react';
import {dateToElapsedTime} from '../util';
import {connect} from 'react-redux'
import {updateReply} from '../actions/comment-actions'

class ReplyList extends React.Component{

    flagComment(id){
        console.log("comment flagged")
        this.props.updateReply(id, {flagged: true})
    }

    render(){
       
        //var icon = {aria_id: 7, icon: "fa-themeisle", color: "color-6"}

        return(
            <div className="reply-list">
                {this.props.replies.map(reply => {
                    var timeElapsed = dateToElapsedTime(reply.updated_at)
                    var icon = this.props.getIcon(reply.user.id)
                    return (
                        <div key={reply.id} className="reply media">
                            <div className="media-left">
                              <i aria-label={"Reply from " + reply.user.affiliation + " " + icon.aria_id}className={"avatar fa " + icon.icon + " " + icon.color }></i>
                            </div>
                            <div className="media-body">
                                <div className="media-heading">
                                    <span className="comment-title">{reply.user.affiliation}</span>
                                    <span className="comment-age">{timeElapsed}</span>
                                </div>
                                <p>{reply.text}</p>
                                <div><a className="flag" onClick={this.flagComment.bind(this, reply.id)}>Flag</a></div>
                            </div>
                      </div>
                    )
                })}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        loggedIn: state.authState.isLoggedIn
    }
}

export default connect(mapStateToProps, {
   updateReply
})(ReplyList);