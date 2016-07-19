import React from 'react';
import { Link } from 'react-router';

class Layout extends React.Component {
    
    render(){
        return(
            <div className="app">
                <header>
                <a className="btn btn-warning log-in">Log In</a>
                <div className="container">
                    <i className="logo fa fa-check-square-o"></i>
                    <Link to="/" className="app-title">Voting Application</Link>
                    <br/>
                </div>
                </header>
                {this.props.children}
            </div>
        )
    }
}

export default Layout;