import React from 'react';
import SearchBar from './SearchBar.jsx';
import AddNew from './AddNew.jsx';
import SelectCategoryContainer from './SelectCategoryContainer.jsx';
import { Link } from 'react-router';

class Admin extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
      return(
        <div>
          <nav className="navbar navbar-default">
          <ul className="nav navbar-nav">
            <li><Link to="/admin">Ideas</Link></li>
            <li><a href="#">Comments</a></li>
            <li><a href="#">Users</a></li>
            <li><a href="#">Categories</a></li>
            <li><Link to="/admin/stages">Stages</Link></li>
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