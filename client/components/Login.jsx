import React from 'react';

class Login extends React.Component{

    render(){
        var display = <a className="btn btn-warning btn-sm pull-right" href="/login">Log In</a>;
        if(this.props.auth.loggedIn){
            display = <div>
                        {this.props.auth.admin && <a className="admin-link" href="/admin"><i className="fa fa-cog"></i>Admin</a>}
                          <div className="pull-right log-out">
                            Logged in as {this.props.auth.netId} (<a href="/logout">Log Out</a>)
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

export default Login;