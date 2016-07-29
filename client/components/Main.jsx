import React from 'react';
import SearchBar from './SearchBar.jsx';
import AddNew from './AddNew.jsx';
import SelectCategoryContainer from './SelectCategoryContainer.jsx';
import IdeaList from './IdeaList.jsx';

class Main extends React.Component {

  render() {

    return (
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
        <p>{this.props.numIdeas} Result{((this.props.numIdeas == 1) ? "" : "s")}</p>
        <SelectCategoryContainer
          addAllOption = {true}
          updateCategory = {this.props.updateCategory}
        /> Select Category
        <hr/>
        <IdeaList
          ideaList = {this.props.ideaList}
        />
      </div>
    );
  }
}

export default Main;