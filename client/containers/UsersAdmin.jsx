import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Link } from 'react-router';
import {fetchUsers} from '../actions/user-actions'
import fetch from 'isomorphic-fetch';
import {parseJSON, handleErrors} from '../util'

const usersPerPage = 5;

class UsersAdmin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            searchTerm: ""
        };
    }

    loadData(){
        this.props.fetchUsers(this.state.currentPage,usersPerPage, this.state.searchTerm);
    }

    componentWillMount(){
        this.loadData();
    }

    deleteUser( id, netid, e ){
        var _this = this;
        var message = "Delete user " + netid + "?";
        if(confirm(message)){
            fetch('/users/' + id, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then(handleErrors)
            .then(parseJSON)
            .then(result => {
                _this.loadData()
            })
            .catch(err => {

            })
        }
    }

    handleSearchField(e){
        this.setState({searchTerm: e.target.value})
    }

    searchUsers(e){
        e.preventDefault();
        this.props.fetchUsers(this.state.currentPage,usersPerPage,this.state.searchTerm);
    }

    //for pagination
    updatePage(newPage){
        this.setState({currentPage: newPage}, function(){
            this.loadData()
        })
    }

    pagination() {
        if(this.props.total <= usersPerPage) return;
        var totalPages = Math.ceil(this.props.total/usersPerPage);
        var pageLinks = [];
        //previous link
        pageLinks.push(<li key="prev" className={this.props.currentPage == 1 ? "disabled" : ""}>
                    <a onClick={this.updatePage.bind(this, (this.state.currentPage > 1 ? (this.state.currentPage - 1) : this.state.currentPage ))} 
                        aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>);
        for (var i = Math.max(this.state.currentPage-3, 1); i <= Math.min(this.state.currentPage+3, totalPages); i++){
          pageLinks.push(<li key={i} className={i == this.state.currentPage ? "active" : ""}>
                          <a onClick={this.updatePage.bind(this, i)}>{i}</a>
                         </li>);
        }
        //next link
        pageLinks.push(<li key="next" className={this.state.currentPage == totalPages ? "disabled" : ""}>
                        <a onClick={this.updatePage.bind(this, (this.state.currentPage < totalPages ? (this.state.currentPage + 1) : this.state.currentPage))} 
                            aria-label="Next">
                          <span aria-hidden="true">&raquo;</span>
                        </a>
                      </li>)
        return pageLinks;
    }

    render(){
        return(
            <div>
                <h3>Users</h3>
                <form action="" onSubmit={this.searchUsers.bind(this)}>
                    <div className="search-bar">
                      <input type="search" className="input-lg" id="search" placeholder="Search By Net ID" onChange={this.handleSearchField.bind(this)} value={this.state.searchTerm}/>
                      <button type="submit" className="icon fa fa-search"></button>
                    </div>
                </form>
                <br/>
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Net ID</th>
                            <th>Affiliation</th>
                            <th>Admin?</th>
                            <th>Comment Moderator?</th>
                            <th>Idea Moderator?</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.users.map(user => {
                                return (
                                    <tr key={user.id}>
                                        <td>{user.firstname}</td>
                                        <td>{user.lastname}</td>
                                        <td>{user.netid}</td>
                                        <td>{user.affiliation}</td>
                                        <td>
                                            {user.admin && <i className="fa fa-check yes-icon" aria-label="User is an admin"></i>}
                                            {!user.admin && <i className="fa fa-times no-icon" aria-label="User is not an admin"></i>}
                                        </td>
                                        <td>{
                                            user.commentMod && <i className="fa fa-check yes-icon" aria-label="User is a comment moderator"></i>}
                                            {!user.commentMod && <i className="fa fa-times no-icon" aria-label="User is not a comment moderator"></i>}
                                        </td>
                                        <td>
                                            {user.ideaMod && <i className="fa fa-check yes-icon" aria-label="User is an idea moderator"></i>}
                                            {!user.ideaMod && <i className="fa fa-times no-icon" aria-label="User is not an idea moderator"></i>}
                                        </td>
                                        <td><Link to={"/admin/users/" + user.id}>Edit</Link></td>
                                        <td><a className="delete-item" onClick={this.deleteUser.bind(this,user.id, user.netid)}><i className="fa fa-trash"></i></a></td>
                                    </tr>
                                )
                            })
                        }
                        <tr>
                            <td colSpan="9"><a className="btn btn-warning btn-sm" href="/admin/users/new">Add User</a></td>
                        </tr>
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
    users: state.userState.users,
    total: state.userState.total,
    errorMessage: state.userState.errorMessage
  }
}

export default connect(mapStateToProps, {
  fetchUsers
})(UsersAdmin)