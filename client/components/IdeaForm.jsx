import React from 'react';
import SelectCategoryContainer from './SelectCategoryContainer.jsx';
import $ from 'jquery';
import Dropzone from 'react-dropzone';

class IdeaForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            text: "",
            categories: [],
            stage: 0,
            attachmentsToUpload: [],
            attachmentsAlreadyUploaded: [],
            attachmentsToDelete: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        var _this = this;
        if(this.props.editMode){
            $.ajax({url: "/ideas/" + _this.props.ideaId + "?files=true", dataType: "json", success: function(result){
                _this.setState({title: result.title,
                                text: result.text,
                                categories: _this.formatCategories(result.categories),
                                stage: result.stage_id || 0,
                                attachmentsAlreadyUploaded: result.files
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

    handleStageChange(e){
        this.setState({stage: e.target.value});
    }

    updateAttachments(files){
        this.setState({attachmentsToUpload: files })
    }

    clearSelectedAttachments(){
        this.setState({attachmentsToUpload: []})
    }

    deleteSavedAttachment(id, e){
        var deleteList = this.state.attachmentsToDelete.slice(0);
        deleteList.push(id);
        this.setState({attachmentsToDelete: deleteList});
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
                attachments: this.state.attachmentsToUpload,
                deleteAttachments: this.state.attachmentsToDelete
        };
        if(this.props.editMode) data.stage = stage;
        this.props.onIdeaSubmit(data);
        this.setState({text: ''});
    }

    render(){
        var selectedAttachments = [];
        for(var i=0; i<this.state.attachmentsToUpload.length; i++){
            selectedAttachments.push(
                <div key={i}>{this.state.attachmentsToUpload[i].name}</div>
            )
        }
        var savedAttachments = [];
        for(var i=0; i<this.state.attachmentsAlreadyUploaded.length; i++){
            savedAttachments.push(
                <div className="row" key={i}>
                    <div className="col-xs-6">
                        {this.state.attachmentsAlreadyUploaded[i].filename}
                    </div>
                    <div className="col-xs-6">
                        <input type="checkbox" value={this.state.attachmentsAlreadyUploaded[i].id} onClick={this.deleteSavedAttachment.bind(this,this.state.attachmentsAlreadyUploaded[i].id)}></input>
                    </div>
                </div>
            )
        }
        // for(var i=0; i<this.state.attachmentsAlreadyUploaded.length; i++){
        //     if($.inArray(this.state.attachmentsAlreadyUploaded[i].id, this.state.attachmentsToDelete) == -1) {
        //         savedAttachments.push(
        //             <div className="row" key={i}>
        //                 <div className="col-xs-6">
        //                     {this.state.attachmentsAlreadyUploaded[i].filename}
        //                 </div>
        //                 <div className="col-xs-6">
        //                     <a href="#" onClick={this.deleteSavedAttachment.bind(this,this.state.attachmentsAlreadyUploaded[i].id)}><i className="fa fa-trash" aria-label="Delete attachment"></i></a>
        //                 </div>
        //             </div>
        //         )
        //     }
        // }

        var editMode = this.props.editMode;
        var displaySavedFiles = this.props.editMode && this.state.attachmentsAlreadyUploaded.length > 0;
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
                    <div className="form-group">
                        <label htmlFor="attachFile">Attachments</label>
                        <div className="row">
                            {(displaySavedFiles) ?
                                    <div className="col-md-4"> 
                                        <div className="attachment-header">Saved Files:</div>
                                        <div className="row">
                                            <div className="col-xs-6">
                                            </div>
                                            <div className="col-xs-6">
                                                <div className="attachment-header">Delete</div>
                                            </div>
                                        </div>
                                        {savedAttachments}
                                    </div>
                                    :
                                    ""
                            }
                            <div className={displaySavedFiles? "col-md-4" : "col-md-4"}>
                                <Dropzone className="attachment-dropzone" onDrop={this.updateAttachments.bind(this)}>
                                  <div>Drop files here or click to select files</div>
                                </Dropzone>
                                {
                                    (this.state.attachmentsToUpload.length > 0) ?
                                        <button className="btn" onClick={this.clearSelectedAttachments.bind(this)}>Remove Selected Files</button>
                                        :
                                        ""
                                }
                            </div>
                            <div className={displaySavedFiles? "col-md-4" : "col-md-8"}>
                                {(this.state.attachmentsToUpload.length > 0) ?
                                    <div> 
                                    <div className="attachment-header">Files to Upload:</div>
                                    {selectedAttachments}
                                    </div>
                                    :
                                    ""
                                }
                            </div>

                        </div>
                        
                    </div>
                    
                    <button type="submit" className="btn btn-warning pull-right">Submit Feature</button>
                </form>
            </div>
        );
    }
}

export default IdeaForm;