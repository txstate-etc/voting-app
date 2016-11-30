import React from 'react';
import SearchBar from './SearchBar.jsx';
import SelectCategoryContainer from './SelectCategoryContainer.jsx';
import IdeaList from './IdeaList.jsx';
import {isLoggedIn} from '../auth';

class Home extends React.Component {

  handlePageChange(newPage, e){
    this.props.updatePage(newPage);
  }

  render() {
    //pagination
    var totalPages = Math.ceil(this.props.ideaCount/this.props.ideasPerPage);
    var pageLinks = [];
    //previous link
    pageLinks.push(<li key="prev" className={this.props.currentPage == 1 ? "disabled" : ""}>
                    <a onClick={this.handlePageChange.bind(this, (this.props.currentPage > 1 ? (this.props.currentPage - 1) : this.props.currentPage ))} 
                        aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>);
    //not sure about the totalPages at the end
    for (var i = Math.max(this.props.currentPage-3, 1); i <= Math.min(this.props.currentPage+3, totalPages); i++){
      pageLinks.push(<li key={i} className={i == this.props.currentPage ? "active" : ""}>
                      <a onClick={this.handlePageChange.bind(this, i)}>{i}</a>
                     </li>);
    }
    pageLinks.push(<li key="next" className={this.props.currentPage == totalPages ? "disabled" : ""}>
                    <a onClick={this.handlePageChange.bind(this, (this.props.currentPage < totalPages ? (this.props.currentPage + 1) : this.props.currentPage))} 
                        aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>)
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
        <nav aria-label="Page navigation" className="text-center">
          <ul className="pagination">
            {pageLinks}
          </ul>
        </nav>
      </div>
    );
  }
}

export default Home;