import React from 'react';
import { Link } from 'react-router';
import Login from './Login.jsx'; 

class Layout extends React.Component {
    
    render(){
        return(
            <div className="app">
                <header>
                <Login/>
                </header>
                <div className="title-bar">
                    <i className="logo fa fa-check-square-o"></i>
                    <Link to="/" className="app-title">Voting Application</Link>
                    <i className="fa fa-bars hamburger pull-right"></i>
                </div>
                {this.props.children}
            </div>
        )
    }
}

export default Layout;