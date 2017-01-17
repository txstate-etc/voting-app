import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import {getIdeas} from '../actions/idea-actions'
import {fetchCategories} from '../actions/category-actions'
import Idea from '../components/Idea.jsx'
import IdeaContainer from './IdeaContainer'
import SelectCategory from '../components/SelectCategory.jsx'
import SearchBar from '../containers/SearchBar.jsx'
import * as types from '../actions/action-types';

class HomePage extends React.Component {

    loadData() {
        this.props.fetchCategories();
        this.props.getIdeas();
    }

    componentWillMount(){
        this.props.setPagination(1,10);
        this.props.updateParameters({votes: true, stageRequired: true})
        this.loadData()
    }

    updateCategory(newCat){
        if(newCat == 0){
            this.props.deleteParameter('category')
        }
        else{
            this.props.updateParameters({category: newCat})
        }
        this.props.updatePage(1)
        this.loadData();  
    }

    //for pagination
    updatePage(newPage){
        this.props.updatePage(newPage);
        this.loadData();
    }

    search(query){
        if(query.length == 0){
            this.props.deleteParameter('search')
        }
        else{
            this.props.updateParameters({search: query})
        }
        this.props.updatePage(1)
        this.loadData();
    }

    pagination() {
        var ideasPerPage = this.props.ideasPerPage;
        var totalPages = Math.ceil(this.props.total/ideasPerPage);
        var pageLinks = [];
        //previous link
        pageLinks.push(<li key="prev" className={this.props.currentPage == 1 ? "disabled" : ""}>
                    <a onClick={this.updatePage.bind(this, (this.props.currentPage > 1 ? (this.props.currentPage - 1) : this.props.currentPage ))} 
                        aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>);
        for (var i = Math.max(this.props.currentPage-3, 1); i <= Math.min(this.props.currentPage+3, totalPages); i++){
          pageLinks.push(<li key={i} className={i == this.props.currentPage ? "active" : ""}>
                          <a onClick={this.updatePage.bind(this, i)}>{i}</a>
                         </li>);
        }
        //next link
        pageLinks.push(<li key="next" className={this.props.currentPage == totalPages ? "disabled" : ""}>
                        <a onClick={this.updatePage.bind(this, (this.props.currentPage < totalPages ? (this.props.currentPage + 1) : this.props.currentPage))} 
                            aria-label="Next">
                          <span aria-hidden="true">&raquo;</span>
                        </a>
                      </li>)
        return pageLinks;
    }

    render(){
        return(
            <div className="container">
                <div className="row top-buffer">
                    <div className="col-sm-6">
                        <SearchBar search={this.search.bind(this)}/>
                    </div>
                    <div className="col-sm-6">
                        <div className="add-new">
                          { this.props.loggedIn && <a className="btn btn-warning" href="/new"><i className="fa fa-plus"></i>&nbsp;Add a New Idea</a>}
                        </div>
                    </div>
                </div>
                <br/>
                <p>{this.props.result.length} {this.props.result.length == 1 ? "Result" : "Results"}</p>
                <SelectCategory
                    options={this.props.categories}
                    addAllOption={true}
                    updateCategory = {this.updateCategory.bind(this)}
                />
                <hr/>
                <div>
                {
                    this.props.result.map(id => {
                        return (
                            <IdeaContainer idea_id={id} key={id}/>
                        )
                    })
                }
                </div>
                <nav aria-label="Page navigation" className="text-center">
                  <ul className="pagination">
                    {this.pagination()}
                  </ul>
                </nav>
            </div>

        )
    }

}

const mapStateToProps = (state, ownProps) => {
  return {
    result: state.ideaState.result,
    total: state.ideaState.total,
    categories: state.categoryState.categories,
    loggedIn: state.authState.isLoggedIn,
    ideasPerPage: state.ideaState.pagination.ideasPerPage,
    currentPage: state.ideaState.pagination.currentPage
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPagination: (currentPage, ideasPerPage) => {
            dispatch({type: types.SET_PAGINATION, currentPage, ideasPerPage})
        },
        updateParameters: (params) => {
            dispatch({type: types.UPDATE_SEARCH_PARAMS, params})
        },
        updateSearchTerm : (query) => {
            dispatch({type: types.UPDATE_SEARCH_PARMS, params: query})
        },
        deleteParameter: (param) => {
            dispatch({type: types.REMOVE_SEARCH_PARAM, param})
        },
        updatePage: (newPage) => {
          dispatch({type: types.UPDATE_PAGE, page: newPage})
        }, 
        getIdeas: bindActionCreators(getIdeas, dispatch),
        fetchCategories: bindActionCreators(fetchCategories, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)