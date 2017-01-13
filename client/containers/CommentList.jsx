import React from 'react';
import { connect } from 'react-redux'
import {getCommentsForIdea, createCommentIcons} from '../selectors/ideaSelectors'
import Comment from '../components/Comment.jsx'
import {updateComment} from '../actions/comment-actions'

class CommentList extends React.Component {

    flagComment(id){
        this.props.updateComment(id, {flagged: true})
    }

    render(){
        return(
            <div className="comment-list">
                <ul className="media-list">
                    {
                        this.props.comments.map(comment =>{
                            return(
                                <Comment key={comment.id}
                                        comment = {comment}
                                        iconList = {this.props.iconList}
                                        loggedIn = {this.props.loggedIn}
                                        flagComment = {this.flagComment.bind(this)}
                                ></Comment>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        comments: getCommentsForIdea(state, ownProps),
        iconList: createCommentIcons(state, ownProps),
        loggedIn: state.authState.isLoggedIn
    }
}

export default connect(mapStateToProps, {
    updateComment
})(CommentList);