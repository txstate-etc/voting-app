import React from 'react'
import { connect } from 'react-redux'
import {fetchFlaggedComments, fetchRejectedComments} from '../actions/comment-actions'
var moment = require('moment');
import { Link } from 'react-router';

var commentsPerPage = 10;

class CommentsAdmin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rejectedCommentsFilter: 0,
            rejectedCommentsPage: 1
        };
    }

    loadRejectedComments(){
        //var dateParam = (this.state.rejectedCommentsFilter == 0)? null : this.state.rejectedCommentsFilter;
        var dateParam;
        switch(this.state.rejectedCommentsFilter){
            case "1d":
                dateParam = moment().subtract(1, 'd').utc().format();
                break;
            case "1w":
                dateParam = moment().subtract(1, 'w').utc().format();
                break;
            case "1m":
                dateParam = moment().subtract(1, 'M').utc().format();
                break;
            case "3m":
                dateParam = moment().subtract(3, 'M').utc().format();
                break;
            case "6m":
                dateParam = moment().subtract(6, 'M').utc().format();
                break;
            default:
                dateParam = null;
        }
        
        var offset = (this.state.rejectedCommentsPage < 1) ? 0 : (this.state.rejectedCommentsPage - 1) * commentsPerPage;
        this.props.fetchRejectedComments(offset, commentsPerPage, dateParam);
    }

    loadData(){
        this.props.fetchFlaggedComments();
        this.loadRejectedComments();
    }

    componentWillMount(){
        console.log("component will mount CommentsAdmin")
        this.loadData();
    }

    updateFilterValue(e){
        this.setState({rejectedCommentsFilter: e.target.value}, () => {
            this.setState({rejectedCommentsPage: 1}, () => {
                this.loadRejectedComments();
            })
        })
    }

    updatePage(page){
        this.setState({rejectedCommentsPage: page}, () => {
            this.loadRejectedComments();
        })
    }

    rejectedCommentsFilter(){
        return(
            <div className="form-group">
                <label htmlFor="dateFilter">Show Comments Rejected: </label>
                <select className="form-control" id="dateFilter" value={this.state.rejectedCommentsFilter} onChange={this.updateFilterValue.bind(this)}>
                    <option value="1d">Within the last day</option>
                    <option value="1w">Within the last week</option>
                    <option value="1m">Within the last month</option>
                    <option value="3m">Within the last three months</option>
                    <option value="6m">Within the last six month</option>
                    <option value="0">Show All</option>
                </select>
            </div>
        )
    }

    pagination() {
        var totalPages = Math.ceil(this.props.total_rejected/commentsPerPage);
        var pageLinks = [];
        //previous link
        pageLinks.push(<li key="prev" className={this.state.rejectedCommentsPage == 1 ? "disabled" : ""}>
                    <a onClick={this.updatePage.bind(this, (this.state.rejectedCommentsPage > 1 ? (this.state.rejectedCommentsPage - 1) : this.state.rejectedCommentsPage ))} 
                        aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>);
        for (var i = Math.max(this.state.rejectedCommentsPage-3, 1); i <= Math.min(this.state.rejectedCommentsPage+3, totalPages); i++){
          pageLinks.push(<li key={i} className={i == this.state.rejectedCommentsPage ? "active" : ""}>
                          <a onClick={this.updatePage.bind(this, i)}>{i}</a>
                         </li>);
        }
        //next link
        pageLinks.push(<li key="next" className={this.state.rejectedCommentsPage == totalPages ? "disabled" : ""}>
                        <a onClick={this.updatePage.bind(this, (this.state.rejectedCommentsPage < totalPages ? (this.state.rejectedCommentsPage + 1) : this.state.rejectedCommentsPage))} 
                            aria-label="Next">
                          <span aria-hidden="true">&raquo;</span>
                        </a>
                      </li>)
        return pageLinks;
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
                                this.props.flagged_comments.map(comment => {
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
                    <h3>Rejected Comments</h3>
                    {this.rejectedCommentsFilter()}
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Comment</th>
                                <th>Note</th>
                                <th>Rejected By</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.rejected_comments.map(rejected_comment => {
                                    return (
                                        <tr key={rejected_comment.id}>
                                            <td>{rejected_comment.comment.text}</td>
                                            <td>{rejected_comment.text}</td>
                                            <td>{rejected_comment.user.netid}</td>
                                            <td>{moment(rejected_comment.updated_at).format('MM/D/YYYY h:mma')}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <nav aria-label="Page navigation" className="text-center">
                        <ul className="pagination">
                            {this.pagination()}
                        </ul>
                    </nav>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    flagged_comments: state.commentState.flagged_comments,
    rejected_comments: state.commentState.rejected_comments,
    total_rejected: state.commentState.total_rejected,
    errorMessage: state.commentState.errorMessage
  }
}

export default connect(mapStateToProps, {
  fetchFlaggedComments,
  fetchRejectedComments
})(CommentsAdmin)