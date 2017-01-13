import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, IndexLink } from 'react-router';

const ACTIVE = { background: '#e7e7e7', fontWeight: 'bold'}

class AdminPage extends React.Component {
    render(){
        return(
            <div>
                <nav className="navbar navbar-default">
                    <ul className="nav navbar-nav">
                        <li><Link to="/admin/ideas" activeStyle={ACTIVE}>Ideas</Link></li>
                        <li><Link to="/admin/comments" activeStyle={ACTIVE}>Comments</Link></li>
                        <li><Link to="/admin/users" activeStyle={ACTIVE}>Users</Link></li>
                        <li><Link to="/admin/categories" activeStyle={ACTIVE}>Categories</Link></li>
                        <li><Link to="/admin/stages" activeStyle={ACTIVE}>Stages</Link></li>
                    </ul>
                </nav>
                <div className="container">
                    {this.props.children}
                </div>
            </div>

        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, {
  
})(AdminPage)