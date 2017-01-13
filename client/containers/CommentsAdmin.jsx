import React from 'react'
import { connect } from 'react-redux'
import {fetchFlaggedComments} from '../actions/comment-actions'
var moment = require('moment');
import { Link } from 'react-router';

class CommentsAdmin extends React.Component {

    loadData(){
        this.props.fetchFlaggedComments();
    }

    componentWillMount(){
        console.log("component will mount CommentsAdmin")
        this.loadData();
    }

    render(){
        return(
            <div>
                    <h3>Flagged Comments</h3>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Comment</th>
                                <th>Idea</th>
                                <th>Author</th>
                                <th>Last Modified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.comments.map(comment => {
                                    return (
                                        <tr key={comment.id}>
                                            <td><Link to={"/admin/comments/edit/" + comment.idea.id + "#comment" + comment.id }>{comment.text}</Link></td>
                                            <td>{comment.idea.title}</td>
                                            <td>{comment.user.netid}</td>
                                            <td>{moment(comment.updated_at).format('MM/D/YYYY h:mma')}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    comments: state.commentState.comments,
    errorMessage: state.commentState.errorMessage
  }
}

export default connect(mapStateToProps, {
  fetchFlaggedComments
})(CommentsAdmin)