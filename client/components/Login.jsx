import React from 'react';
import { connect } from 'react-redux'
import {Link, browserHistory} from 'react-router'
import {receiveLogout} from '../actions/auth-actions'
import cookie from 'react-cookie';

class Login extends React.Component{

    handleLogout(){
        cookie.remove('user')
        this.props.onLogoutClick();
        location.replace("/logout")
    }

    render(){
        var currentPage = this.props.currentPage
        var display = <a className="btn btn-warning btn-sm pull-right" href={"/login?url=" + currentPage.replace(/\//g, '%2F')}>Log In</a>;
        if(this.props.loggedIn){
            display = <div>
                        {<a className="admin-link" href="/admin"><i className="fa fa-cog"></i>Admin</a>}
                          <div className="pull-right log-out">
                            Logged in as {this.props.netId} (<a onClick={() => {this.handleLogout()}}>Log Out</a>)
                          </div>
                        </div>;
        }
        return(
            <div className="clearfix">
            {display}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loggedIn: state.authState.isLoggedIn,
    netId: state.authState.netid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogoutClick: () => {
      dispatch(receiveLogout())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)