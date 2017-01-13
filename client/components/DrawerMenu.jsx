import React from 'react';

class DrawerMenu extends React.Component {

    render(){
        //var currentPage = encodeURIComponent(this.props.currentPage);
        var currentPage = '/'
        return(
            <nav role="navigation" className={"mobile-drawer " + (this.props.visible? "visible" : "") }>
                <h3 className="mobile-drawer-title">Voting Application</h3>
                <ul>
                    {!this.props.isLoggedIn && <li><a className="drawer-menu-item" href={"/login"}>Login</a></li> }
                    {this.props.isAdmin && <li><a className="drawer-menu-item">Admin</a></li> }
                    {this.props.isLoggedIn && <li><a className="drawer-menu-item" href={"/logout"}>Log Out</a></li> }
                </ul>
            </nav>
        );
    }
}

export default DrawerMenu;