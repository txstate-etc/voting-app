import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';

class UserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "", 
            firstNameErr: "",
            lastName: "",
            lastNameErr: "",
            netid: "",
            netidErr: "",
            affiliation: "student",
            admin: false,
            commentMod: false,
            ideaMod: false

        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        var _this = this;
        if(this.props.route.editMode){
            var id = this.props.params.userId;
            $.ajax({url: "/users/" + id, dataType: "json", success: function(result){
                _this.setState({firstName: result.firstname});
                _this.setState({lastName: result.lastname});
                _this.setState({netid: result.netid});
                _this.setState({affiliation: result.affiliation});
                _this.setState({admin: result.admin});
                _this.setState({commentMod: result.commentMod});
                _this.setState({ideaMod: result.ideaMod});
            }});
        }
    }

    handleFirstNameChange(e){
        this.setState({firstName: e.target.value});
        if(e.target.value.length > 0)
            this.setState({firstNameErr: ""})
    }

    handleLastNameChange(e){
        this.setState({lastName: e.target.value});
        if(e.target.value.length > 0)
            this.setState({lastNameErr: ""})
    }

    handleNetIdChange(e){
        this.setState({netid: e.target.value});
        if(e.target.value.length > 0)
            this.setState({netidErr: ""})
    }

    handleAffiliationChange(e){
        this.setState({affiliation: e.target.value})
    }

    handleAdminStatusChange(e){
        var isAdmin = e.target.checked ? true : false;
        this.setState({admin: isAdmin});
    }

    handleCommentModStatusChange(e){
        var isCommentMod = e.target.checked ? true : false;
        this.setState({commentMod: isCommentMod});
    }

    handleIdeaModStatusChange(e){
        var isIdeaMod = e.target.checked ? true : false;
        this.setState({ideaMod: isIdeaMod});
    }

    handleSubmit(e){
        var _this = this;
        e.preventDefault();
        var firstname = this.state.firstName;
        if(!firstname){
            this.setState({firstNameErr: "Please enter a first name"});
            return;
        }
        var lastname = this.state.lastName;
        if(!lastname){
            this.setState({lastNameErr: "Please enter a last name"});
            return;
        }
        var netid = this.state.netid;
        if(!netid){
            this.setState({netidErr: "Please enter a net ID"});
            return;
        }
        var editMode = this.props.route.editMode;
        var data={
            firstname: firstname,
            lastname: lastname,
            netid: netid,
            affiliation: this.state.affiliation,
            admin: this.state.admin,
            commentMod: this.state.commentMod,
            ideaMod: this.state.ideaMod
        }

        if(editMode){
            var id = this.props.params.userId;
            $.ajax({url: "/users/" + id, 
                dataType: "json",
                data: data,
                method: 'PUT',
                success: function(result){
                    _this.props.editUser(result);
                    browserHistory.push('/admin/users');
                }})
        }
        else{
            $.ajax({url: "/users/", 
                dataType: "json",
                data: data,
                method: 'POST',
                success: function(result){
                     _this.props.addUser(result);
                    browserHistory.push('/admin/users');
                }})
        }
    }

    handleCancel(e){
        e.preventDefault();
        browserHistory.goBack();
    }

    render(){
        var invalidFirstName = this.state.firstNameErr.length > 0;
        var invalidLastName = this.state.lastNameErr.length > 0;
        var invalidNetId = this.state.netidErr.length > 0;
        return(
            <div className="container">
                <h3>{this.props.route.editMode ? "Edit User" : "Add User"}</h3>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstname">First Name:</label>
                        <span className="errorMsg" role={invalidFirstName ? "alert" : ""}>{this.state.firstNameErr}</span>
                        <input className="form-control" 
                                id="firstname" 
                                type="text" 
                                value={this.state.firstName} 
                                onChange={this.handleFirstNameChange.bind(this)}
                                ref={function(input) {
                                  if (input != null && invalidFirstName) {
                                    input.focus();
                                  }
                                }}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Last Name:</label>
                        <span className="errorMsg" role={invalidLastName ? "alert" : ""}>{this.state.lastNameErr}</span>
                        <input className="form-control" 
                                id="lastname" 
                                type="text" 
                                value={this.state.lastName} 
                                onChange={this.handleLastNameChange.bind(this)}
                                ref={function(input) {
                                  if (input != null && invalidLastName) {
                                    input.focus();
                                  }
                                }}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="netid">Net ID:</label>
                        <span className="errorMsg" role={invalidNetId ? "alert" : ""}>{this.state.netidErr}</span>
                        <input className="form-control" 
                                id="netid" 
                                type="text" 
                                value={this.state.netid} 
                                onChange={this.handleNetIdChange.bind(this)}
                                ref={function(input) {
                                  if (input != null && invalidNetId) {
                                    input.focus();
                                  }
                                }}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="affiliation">Affiliation:</label>
                        <select id="affiliation" onChange={this.handleAffiliationChange.bind(this)} value={this.state.affiliation}>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="staff">Staff</option>
                            <option value="moderator">Moderator</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="administrator">Admin:</label>
                        <input className="user-form-checkbox"
                         id="administrator"
                         type="checkbox"
                         checked={this.state.admin ? "checked" : ""}
                         onChange={this.handleAdminStatusChange.bind(this)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="comment-mod">Comment Moderator:</label>
                        <input className="user-form-checkbox"
                         id="comment-mod"
                         type="checkbox"
                         checked={this.state.commentMod ? "checked" : ""}
                         onChange={this.handleCommentModStatusChange.bind(this)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="idea-mod">Idea Moderator:</label>
                        <input className="user-form-checkbox"
                         id="idea-mod"
                         type="checkbox"
                         checked={this.state.ideaMod ? "checked" : ""}
                         onChange={this.handleIdeaModStatusChange.bind(this)}/>
                    </div>
                    <div className="admin-form-buttons pull-right">
                        <button type="submit" className="btn btn-warning save">Save Changes</button>
                        <button className="btn btn-warning" onClick={this.handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default UserForm;