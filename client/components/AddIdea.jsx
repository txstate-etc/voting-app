import React from 'react';
import SelectCategoryContainer from './SelectCategoryContainer.jsx';

class AddIdea extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            text: "",
            categories: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTitleChange(e) {
        this.setState({title: e.target.value});
    }

    handleTextChange(e) {
        this.setState({text: e.target.value});
    }

    handleCheckbox(e){
        if(e.target.checked){
            this.state.categories.push(e.target.value);
        }
        else{
            var index = this.state.categories.indexOf(e.target.value);
            if(index > -1){
                this.state.categories.splice(index, 1);
            }
        }
    }

    handleSubmit(e){
        e.preventDefault();
        var title=this.state.title;
        if(!title){
            return;
        }
        var text=this.state.text;
        if(!text){
            return;
        }
        var categories=this.state.categories;
        if(!categories){
            return;
        }
        this.props.onIdeaSubmit(
            {
                title: title,
                text: text,
                categories: categories
            }
        );
        this.setState({text: ''});
    }

    render(){
        return (
            <div className="container">
                <form action="" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" className="form-control" placeholder="Title for Feature Request" value={this.state.title} onChange={this.handleTitleChange.bind(this)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="categories">Categories</label>
                        <div className="row" id="categories">
                            {this.props.categories.map(category => {
                                return (
                                    <div key={category.id} className="col-xs-6 col-sm-4 col-md-3">
                                        <label htmlFor={"category" + category.id}>
                                            <input type="checkbox" name="categories" value={category.id} id={"category" + category.id} onChange={this.handleCheckbox.bind(this)}/>{category.name}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="attachFile">Add Attachments</label>
                        <input type="file" id="attachFile"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="text">Description</label>
                        <textarea id="text" rows="15" className="form-control" placeholder="Describe feature..." value={this.state.text} onChange={this.handleTextChange.bind(this)}>
                        </textarea>
                    </div>

                    <button type="submit" className="btn btn-warning pull-right">Submit Feature</button>
                </form>
            </div>
        );
    }
}

export default AddIdea;