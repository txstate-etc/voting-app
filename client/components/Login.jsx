import React from 'react';
import {isLoggedIn, getNetId, isAdmin} from '../auth';

class Login extends React.Component{

    render(){
        var button = <a className="btn btn-warning pull-right" href="/login">Log In</a>;
        if(isLoggedIn()){
            //button = <a className="btn btn-warning log-in" href="/logout">Log Out</a>;
            button = <div className="pull-right log-out">
                        Logged in as {getNetId()} (<a href="/logout">Log Out</a>)
                        {isAdmin() ? <p><a className="admin-link" href="/admin"><i className="fa fa-cog"></i>Admin</a></p>  : "Not Admin"}
                    </div>;
        }
        return(
            <div>
            {button}
            </div>
        );
    }
}

export default Login;