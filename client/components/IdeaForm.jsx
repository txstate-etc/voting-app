import React from 'react';
import SelectCategoryContainer from './SelectCategoryContainer.jsx';
import $ from 'jquery';

class IdeaForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            text: "",
            categories: [],
            stage: 0,
            attachment: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        var _this = this;
        if(this.props.editMode){
            $.ajax({url: "/ideas/" + _this.props.ideaId, dataType: "json", success: function(result){
                _this.setState({title: result.title,
                                text: result.text,
                                categories: _this.formatCategories(result.categories),
                                stage: result.stage_id || 0
                                });
            }});
        }
    }

    formatCategories(categories){
        var cat= categories.map(function(obj){
            return obj.id.toString();
        });
        return cat;
    }

    handleTitleChange(e) {
        this.setState({title: e.target.value});
    }

    handleTextChange(e) {
        this.setState({text: e.target.value});
    }

    handleCheckbox(e){
        var categories = this.state.categories.slice(0);
        if(e.target.checked){
            categories.push(e.target.value);
        }
        else{
            var index = categories.indexOf(e.target.value);
            if(index > -1){
                categories.splice(index, 1);
            }
        }
        this.setState({categories: categories});
    }

    handleAttachment(e){
        this.setState({attachment: e.target.files[0]})  //will we allow more than one attachment?
    }

    handleStageChange(e){
        this.setState({stage: e.target.value});
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
        var stage=this.state.stage;
        if((this.props.editMode && !stage)){
            if(stage ==0)
                return;
        }
        var data = {
                title: title,
                text: text,
                categories: categories,
                attachment: this.state.attachment
        };
        if(this.props.editMode) data.stage = stage;
        this.props.onIdeaSubmit(data);
        this.setState({text: ''});
    }

    render(){
        var editMode = this.props.editMode;
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
                                            <input type="checkbox" name="categories" value={category.id} id={"category" + category.id} checked={(this.state.categories.indexOf(category.id.toString()) > -1)? "checked" : ""} onChange={this.handleCheckbox.bind(this)}/>{category.name}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="attachFile">Add Attachments</label>
                        <input type="file" id="attachFile" onChange={this.handleAttachment.bind(this)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="text">Description</label>
                        <textarea id="text" rows="15" className="form-control" placeholder="Describe feature..." value={this.state.text} onChange={this.handleTextChange.bind(this)}>
                        </textarea>
                    </div>
                    {this.props.editMode ? 
                        <div className="form-group">
                            <label htmlFor="stage">Stage</label>
                            <select id="stage" onChange={this.handleStageChange.bind(this)} value={this.state.stage}>
                                <option key="0" value="0">Please Select</option>
                                {this.props.stages.map(option => {
                                    return (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        :
                        ""
                    }
                    <button type="submit" className="btn btn-warning pull-right">Submit Feature</button>
                </form>
            </div>
        );
    }
}

export default IdeaForm;