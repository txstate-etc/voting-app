import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import update from 'react-addons-update';

class CategoriesIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            categoriesToDelete: [] 
        };
    }

    componentDidMount(){
        var _this = this;
        $.ajax({url: "/categories", dataType: "json", success: function(result){
            _this.setState({categories: result});
        }});
    }

    addCategory(category){
        if(category){
            var categories = update(this.state.categories, {$push: [category]});
            this.setState({categories: categories});
        }
    }

    editCategory(editedCategory){
        if(editedCategory){
            var categories = this.state.categories.map(function(category){
                if(category.id == editedCategory.id){
                    return editedCategory;
                }
                else{
                    return category;
                }
            })
            this.setState({categories: categories});
        }
    }

    deleteCategory(id, e){
        var deleteList = this.state.categoriesToDelete.slice(0);
        if(e.target.checked){
            deleteList.push(id);
            this.setState({categoriesToDelete: deleteList});
        }
        else{
            this.removeFromDeleteList(id);
        }
    }

    removeFromDeleteList(id){
        var deleteList = this.state.categoriesToDelete.slice(0);
        var index = deleteList.indexOf(id);
        if(index > -1){
            deleteList.splice(index, 1);
        }
        this.setState({categoriesToDelete: deleteList});
    }

    handleDeletions(){
        var _this = this;
        var count = this.state.categoriesToDelete.length;
        var confirmationMessage = "Delete " + count + " categor" + ((count == 1) ? "y?" : "ies?");
        if(confirm(confirmationMessage)){
            var deletions = this.state.categoriesToDelete.map(function (id) { 
                return $.ajax({
                    url: "/categories/" + id,
                    method: 'DELETE',
                    dataType: "json",
                    success: function(result){
                        //remove category from display list
                        var categories = _this.state.categories.filter(function(category){
                            return category.id != id;
                        })
                        _this.setState({categories: categories});
                        //clear from list of items to be deleted
                        _this.removeFromDeleteList(id);
                    }
                }); 
            });

        }
    }

    render(){
        //pass a callback to the children so they can update the parent (category list) state
        var _this = this;
        var children = React.Children.map(this.props.children, function(child){
            return React.cloneElement(child, {
                addCategory: _this.addCategory.bind(_this),
                editCategory: _this.editCategory.bind(_this)
            })
        });
        return(
            <div>
                {children ||
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
                                this.state.categories.map(category => {
                                    return (
                                        <tr key={category.id}>
                                            <td><Link to={"/admin/categories/" + category.id}>{category.name}</Link></td>
                                            <td><input type="checkbox" value={category.id} onClick={this.deleteCategory.bind(this,category.id)}/></td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td colSpan="2"><a className="btn btn-warning btn-sm" href="/admin/categories/add">Add Category</a></td>
                            </tr>
                        </tbody>
                    </table>
                    { this.state.categoriesToDelete.length > 0 && <button className="btn btn-warning btn-sm pull-right" onClick={this.handleDeletions.bind(this)}>Delete Selected Categories</button>}
                </div>
            }
            </div>
        )
    }
}

export default CategoriesIndex;