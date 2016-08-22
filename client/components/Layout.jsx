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
                    <br/>
                </div>
                {this.props.children}
                <footer>
                    <a href="#">
                        <i className="fa fa-question"></i>
                         Help
                    </a>
                </footer>
            </div>
        )
    }
}

export default Layout;