import React from 'react';
import { Link } from 'react-router';
import Login from './Login.jsx'; 
import DrawerMenu from './DrawerMenu.jsx'; 
import $ from 'jquery';

class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuVisible: false
        };
    }
    
    showMenu(){
        this.setState({'menuVisible': true})
    }

    hideMenu(){
        this.setState({'menuVisible': false})
    }

    handleClick(e){
        var target = $(e.target);
        if (this.state.menuVisible && !target.is('.hamburger') && !target.closest('.mobile-drawer').length) {
          e.preventDefault();
          this.hideMenu();
        }
    }

    render(){
        //pass auth to all children
        var _this = this;
        var children = React.Children.map(this.props.children, function(child){
            return React.cloneElement(child, {
                auth: _this.props.auth
            })
        });
        return(
            <div className="app" onClick={this.handleClick.bind(this)}>
                <header>
                <Login
                    auth = {this.props.auth}
                    currentPage = {this.props.location.pathname}
                />
                </header>
                <DrawerMenu
                    auth = {this.props.auth}
                    visible = {this.state.menuVisible}
                    currentPage = {this.props.location.pathname}
                />
                <div className="title-bar">
                    <i className="logo fa fa-check-square-o"></i>
                    <Link to="/" className="app-title">Voting Application</Link>
                    <a onClick={this.showMenu.bind(this)}><i className="fa fa-bars hamburger pull-right"></i></a>
                </div>
                {children}
            </div>
        )
    }
}

export default Layout;