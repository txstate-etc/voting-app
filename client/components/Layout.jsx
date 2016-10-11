import React from 'react';
import { Link } from 'react-router';
import Login from './Login.jsx'; 

class Layout extends React.Component {
    
    render(){
        //pass auth to all children
        var _this = this;
        var children = React.Children.map(this.props.children, function(child){
            return React.cloneElement(child, {
                auth: _this.props.auth
            })
        });
        return(
            <div className="app">
                <header>
                <Login
                    auth = {this.props.auth}
                    currentPage = {this.props.location.pathname}
                />
                </header>
                <div className="title-bar">
                    <i className="logo fa fa-check-square-o"></i>
                    <Link to="/" className="app-title">Voting Application</Link>
                    <i className="fa fa-bars hamburger pull-right"></i>
                </div>
                {children}
            </div>
        )
    }
}

export default Layout;