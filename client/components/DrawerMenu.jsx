import React from 'react';

class DrawerMenu extends React.Component {

    render(){
        var currentPage = encodeURIComponent(this.props.currentPage);
        return(
            <nav role="navigation" className={"mobile-drawer " + (this.props.visible? "visible" : "") }>
                <h3 className="mobile-drawer-title">Voting Application</h3>
                <ul>
                    {!this.props.auth.loggedIn && <li><a className="drawer-menu-item" href={"/login?url=" + currentPage}>Login</a></li>}
                    {this.props.auth.admin && <li><a className="drawer-menu-item" href="/admin">Admin</a></li>}
                    {this.props.auth.loggedIn && <li><a className="drawer-menu-item" href={"/logout"}>Log Out</a></li>}
                </ul>
            </nav>
        );
    }
}

export default DrawerMenu;