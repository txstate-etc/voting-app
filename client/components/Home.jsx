import React from 'react';
import SearchBar from './SearchBar.jsx';
import SelectCategoryContainer from './SelectCategoryContainer.jsx';
import IdeaList from './IdeaList.jsx';
import {isLoggedIn} from '../auth';

class Home extends React.Component {

  render() {

    return (
      <div className="container">
        <div className="row top-buffer">
          <div className="col-sm-6">
            <SearchBar
              search = {this.props.search}
            />
          </div>
          <div className="col-sm-6">
            <div className="add-new">
              {isLoggedIn() && <a className="btn btn-warning" href="/new"><i className="fa fa-plus"></i>&nbsp;Add a New Idea</a>}
            </div>
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

export default Home;