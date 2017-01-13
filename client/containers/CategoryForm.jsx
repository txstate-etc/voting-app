import React from 'react'
import {connect} from 'react-redux'
import { browserHistory } from 'react-router'
import {fetchCategories, addCategory, updateCategory} from '../actions/category-actions'

class CategoryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "", 
            categoryErr: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    loadData(){
        this.props.fetchCategories()
    }

    componentWillMount(){
        this.loadData()
    }

    componentDidMount(){
        this.updateCategoryState(this.props)
    }

    updateCategoryState(props){
        if(props.categories.length > 0 && props.route.editMode){
            var category = props.categories.filter(cat =>{
                return cat.id == props.params.category_id;
            })
            if(category[0])
                this.setState({name: category[0].name})
            else{
               //they can't edit a category that doesn't exist!
                browserHistory.push('/notfound')
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.updateCategoryState(nextProps)
    }

    handleNameChange(e){
        this.setState({name: e.target.value});
        if(e.target.value.length > 0)
            this.setState({categoryErr: ""})
    }

    handleSubmit(e){
        e.preventDefault();
        var name = this.state.name;
        if(!name){
            this.setState({categoryErr: "Please enter a category name"});
            return;
        }
        var editMode = this.props.route.editMode;
        if(editMode){
            var id = this.props.params.category_id;
            this.props.updateCategory(id, {name: name})
        }
        else{
            this.props.addCategory(name)
        }
        browserHistory.push('/admin/categories')
    }

    handleCancel(e){
        e.preventDefault();
        browserHistory.push('/admin/categories')
    }

    render(){
        var invalidName = this.state.categoryErr.length > 0;
        return(
            <div className="container">
                <h3>{this.props.route.editMode ? "Edit Category" : "Add Category"}</h3>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="category">Name:</label>
                        <span className="errorMsg" role={invalidName ? "alert" : ""}>{this.state.categoryErr}</span>
                        <input className="form-control" 
                                id="category" 
                                type="text" 
                                value={this.state.name} 
                                onChange={this.handleNameChange.bind(this)}
                                ref={function(input) {
                                  if (input != null && invalidName) {
                                    input.focus();
                                  }
                                }}/>
                    </div>
                    <div className="admin-form-buttons pull-right">
                        <button type="submit" className="btn btn-warning save">Save Changes</button>
                        <button className="btn btn-warning" onClick={this.handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        categories: state.categoryState.categories
    }
}

export default connect(mapStateToProps, {
  fetchCategories,
  addCategory,
  updateCategory
})(CategoryForm)