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
                <SearchBar/>
                <AddNew />
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