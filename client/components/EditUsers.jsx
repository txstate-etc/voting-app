import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';

class EditUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            usersToDelete: []
        };
    }

    componentDidMount(){
        var _this = this;
        $.ajax({url: "/users", dataType: "json", success: function(results){
            _this.setState({users: results});
        }});
    }

    deleteUser( id, e ){
        var deleteList = this.state.usersToDelete.slice(0);
        if(e.target.checked){
            deleteList.push(id);
            this.setState({usersToDelete: deleteList});
        }
        else{
            this.removeFromDeleteList(id);
        }
    }

    handleDeletions(){
        var _this = this;
        var count = this.state.usersToDelete.length;
        var confirmationMessage = "Delete " + count + " user" + ((count == 1) ? "?" : "s?");
        if(confirm(confirmationMessage)){
            var deletions = this.state.usersToDelete.map(function (id) { 
                return $.ajax({
                    url: "/users/" + id,
                    method: 'DELETE',
                    dataType: "json",
                    success: function(result){
                        //remove user from display list
                        var users = _this.state.users.filter(function(user){
                            return user.id != id;
                        })
                        _this.setState({users: users});
                        //clear from list of items to be deleted
                        _this.removeFromDeleteList(id);
                    }
                }); 
            });

        }
    }

    removeFromDeleteList(id){
        var deleteList = this.state.usersToDelete.slice(0);
        var index = deleteList.indexOf(id);
        if(index > -1){
            deleteList.splice(index, 1);
        }
        this.setState({usersToDelete: deleteList});
    }

    render(){
        return(
            <div>
            {
                this.props.children ||
                <div>
                    <h3>Users</h3>
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
                                this.state.users.map(user => {
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
                                            <td><input type="checkbox" value={user.id} onClick={this.deleteUser.bind(this,user.id)}/></td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td colSpan="9"><a className="btn btn-warning btn-sm" href="/admin/users/add">Add User</a></td>
                            </tr>
                        </tbody>
                    </table>
                    { this.state.usersToDelete.length > 0 && <button className="btn btn-warning btn-sm pull-right" onClick={this.handleDeletions.bind(this)}>Delete Selected Users</button>}
                </div>
            }
            </div>
        );
    }
}

export default EditUsers;