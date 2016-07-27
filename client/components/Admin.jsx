import React from 'react';
import SearchBar from './SearchBar.jsx';
import AddNew from './AddNew.jsx';
import SelectCategoryContainer from './SelectCategoryContainer.jsx';
class Admin extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className="container">
                <div className="row top-buffer">
                  <div className="col-md-6">
                    <SearchBar/>
                  </div>
                  <div className="col-md-6">
                    <div className="pull-right"><AddNew /></div>
                  </div>
                </div>
                <br/>
                <SelectCategoryContainer
                  updateCategory = {this.props.updateCategory}
                /> Select Category
                <hr/>
            </div>
        );
    }
}

export default Admin;