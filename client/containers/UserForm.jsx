import React from 'react'
import {connect} from 'react-redux'
import { browserHistory } from 'react-router'
import {fetchUser} from '../actions/user-actions'
import fetch from 'isomorphic-fetch';
import {parseJSON, handleErrors} from '../util'


class UserForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
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

    loadData(){
        this.props.fetchUser(this.props.params.user_id)
    }

    componentWillMount(){
        this.loadData()
        if(this.props.params.user_id)
            this.setState({editMode: true})
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.editMode){
           this.setState({
                firstName: nextProps.user.firstname,
                lastName: nextProps.user.lastname,
                netid: nextProps.user.netid,
                affiliation: nextProps.user.affiliation,
                admin: nextProps.user.admin,
                commentMod: nextProps.user.commentMod,
                ideaMod: nextProps.user.ideaMod
           })
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
        var data={
            firstname: firstname,
            lastname: lastname,
            netid: netid,
            affiliation: this.state.affiliation,
            admin: this.state.admin,
            commentMod: this.state.commentMod,
            ideaMod: this.state.ideaMod
        }
        var method = 'POST';
        var url = '/users';
        if(this.state.editMode){
            method = 'PUT';
            url += '/' + this.props.params.user_id
        }
        fetch(url,{
              method: method,
              body: JSON.stringify(data),
              credentials: 'include',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(result => {
            browserHistory.push('/admin/users');
        })
        .catch(function(err){
            console.log(err)
            //error page
        })

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
                <h3>{this.state.editMode ? "Edit User" : "Add User"}</h3>
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
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.userState.users[0]
    }
}

export default connect(mapStateToProps, {
  fetchUser
})(UserForm)