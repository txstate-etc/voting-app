import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';

class CategoryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "", 
            categoryErr: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        var _this = this;
        if(this.props.route.editMode){
            var id = this.props.params.categoryId;
            $.ajax({url: "/categories/" + id, dataType: "json", success: function(result){
                _this.setState({name: result.name});
            }});
        }

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
        var data={
            name: name
        }
        if(editMode){
            var id = this.props.params.categoryId;
            $.ajax({url: "/categories/" + id, 
                dataType: "json",
                data: data,
                method: 'PUT',
                success: function(result){
                    browserHistory.push('/admin/categories');
                }})
        }
        else{
            $.ajax({url: "/categories/", 
                dataType: "json",
                data: data,
                method: 'POST',
                success: function(result){
                    browserHistory.push('/admin/categories');
                }})
        }
        
    }

    handleCancel(){
        browserHistory.push('/admin/categories');
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

export default CategoryForm;