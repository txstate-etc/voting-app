import React from 'react';
import SearchBar from './SearchBar.jsx';
import AddNew from './AddNew.jsx';
import SelectCategoryContainer from './SelectCategoryContainer.jsx';
import { Link, IndexLink } from 'react-router';

const ACTIVE = { background: '#e7e7e7', fontWeight: 'bold'}

class Admin extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
      return(
        <div>
          <nav className="navbar navbar-default">
          <ul className="nav navbar-nav">
            <li><IndexLink to="/admin" activeStyle={ACTIVE}>Ideas</IndexLink></li>
            <li><a href="#">Comments</a></li>
            <li><a href="#">Users</a></li>
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

export default Admin;