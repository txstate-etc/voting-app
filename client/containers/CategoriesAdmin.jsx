import React from 'react'
import { connect } from 'react-redux'
import {fetchCategories, addCategory, updateCategory, deleteCategory} from '../actions/category-actions'
import { Link } from 'react-router'
import Modal from 'react-modal'
import SelectCategory from '../components/SelectCategory.jsx'
import {isEmpty} from '../util'

class CategoriesAdmin extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            categoryToDelete: {},
            newCategoryAssignment: 0,
            newCategoryError: false
        };
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    loadData(){
        this.props.fetchCategories();
    }

    componentWillMount(){
        this.loadData();
    }

    deleteCategory(id, name){
        this.setState({categoryToDelete: {id, name}})
        this.openModal()
    }

    assignNewCategory(id){
        this.setState({newCategoryError: false})
        this.setState({newCategoryAssignment: id})
    }

    reassignCategory(e){
        e.preventDefault();
        var _this = this;
        if(this.state.newCategoryAssignment == 0){
            this.setState({newCategoryError: true})
            return;
        }
        this.props.deleteCategory(parseInt(this.state.categoryToDelete.id) , parseInt(this.state.newCategoryAssignment))
        .then(function(){
            if(_this.props.errorMessage.length == 0)
                _this.setState({modalIsOpen: false})
        })
    }

    render(){
        //create list of alternative category options if the user wants to delete a category
        if(!isEmpty(this.state.categoryToDelete)){
            var _this = this;
            var alternateCategories = this.props.categories.filter(function(cat){
                return cat.id != _this.state.categoryToDelete.id
            })
        }
        return(
            <div>
                <h3>Categories</h3>
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.categories.map(category => {
                                return (
                                    <tr key={category.id}>
                                        <td><Link to={"/admin/categories/" + category.id}>{category.name}</Link></td>
                                        <td><a className="delete-item" onClick={this.deleteCategory.bind(this, category.id, category.name)}><i className="fa fa-trash" aria-label={"Delete " + category.name + " category."}></i></a></td>
                                    </tr>
                                )
                            })

                        }
                        <tr>
                            <td colSpan="2"><a className="btn btn-warning btn-sm" href="/admin/categories/new">Add Category</a></td>
                        </tr>
                    </tbody>
                </table>
                {
                    !isEmpty(this.state.categoryToDelete) &&
                    <Modal
                      className="item-reassignment-modal"
                      overlayClassName="item-reassignment-overlay"
                      isOpen={this.state.modalIsOpen}
                      onRequestClose={this.closeModal.bind(this)}
                      contentLabel="Update Category">
                        <div>
                            <h2>Move Ideas to New Category</h2>
                            <p>You are deleting the <b>{this.state.categoryToDelete.name}</b> category.  Please select a new 
                            category for the ideas in this category.
                            </p>
                            <form onSubmit={this.reassignCategory.bind(this)}>
                                {this.state.newCategoryError && <p className="errorMsg">Please select a category.</p>}
                                <p className="errorMsg">{this.props.errorMessage}</p>
                                <label htmlFor="category">Category:</label>
                                <SelectCategory
                                    options={alternateCategories}
                                    addAllOption={false}
                                    updateCategory = {this.assignNewCategory.bind(this)}/>
                                <div className="modalButtons">
                                    <button type="submit" onClick={this.reassignCategory.bind(this)} className="btn btn-warning">Reassign Category</button>
                                    <button onClick={this.closeModal.bind(this)} className="btn btn-warning">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                }
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    categories: state.categoryState.categories,
    errorMessage: state.categoryState.errorMessage
  }
}

export default connect(mapStateToProps, {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory
})(CategoriesAdmin)