import React from 'react';
import SearchBar from './SearchBar.jsx';
import AddNew from './AddNew.jsx';
import SelectCategoryContainer from './SelectCategoryContainer.jsx';
import IdeaList from './IdeaList.jsx';

class Main extends React.Component {

  render() {

    return (
      <div className="container">
        <SearchBar/>
        <AddNew />
        <br/>
        <p>{this.props.numIdeas} Result{((this.props.numIdeas == 1) ? "" : "s")}</p>
        <SelectCategoryContainer
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