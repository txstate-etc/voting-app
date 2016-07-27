import React from 'react';
import Comment from './Comment.jsx'

class CommentList extends React.Component {
    render(){
        return(
            <div className="comment-list">
                <ul className="media-list">
                    {this.props.commentList.map(comment => {
                        return (
                            <Comment
                                key = {comment.id}
                                comment = {comment}
                            />
                        )
                    })}
                </ul>
            </div>
        );
    }
}

export default CommentList;