import React from 'react';
import { findDOMNode } from 'react-dom';
import SelectCategoryContainer from './SelectCategoryContainer.jsx';
import $ from 'jquery';
import Dropzone from 'react-dropzone';

class IdeaForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            titleErr: "",
            text: "",
            textErr: "",
            categories: [],
            catErr: "",
            stage: 0,
            stageErr: "",
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
        if(e.target.value.length > 0)
            this.setState({titleErr: ""})
    }

    handleTextChange(e) {
        this.setState({text: e.target.value});
        if(e.target.value.length > 0)
            this.setState({textErr: ""})
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
        if(categories.length > 0)
            this.setState({catErr: ""})
    }

    handleStageChange(e){
        this.setState({stage: e.target.value});
        if(e.target.value > 0)
            this.setState({stageErr: ""})
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
            this.setState({titleErr: "Please enter a title"});
            return;
        }
        var categories=this.state.categories;
        if(categories.length < 1){
            this.setState({catErr: "Please select at least one category"});
            return;
        }
        var text=this.state.text;
        if(!text){
            this.setState({textErr: "Please enter a description"});
            return;
        }
        var stage=this.state.stage;
        if((this.props.editMode && !stage)){
            if(stage ==0){
                this.setState({stageErr: "Please select a stage"});
                return;
            }
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
        
        var editMode = this.props.editMode;
        var displaySavedFiles = this.props.editMode && this.state.attachmentsAlreadyUploaded.length > 0;
        var invalidTitle = this.state.titleErr.length > 0;
        var invalidText = this.state.textErr.length > 0;
        var invalidCategory = this.state.catErr.length > 0;
        var invalidStage = this.state.stageErr.length > 0;
        return (
            <div className="container">
                <form action="" onSubmit={this.handleSubmit}>
                    <div className={"form-group" + (invalidTitle ? " has-warning" : "")}>
                        <label htmlFor="title">Title</label>
                        <span className="errorMsg" role={invalidTitle ? "alert" : ""}>{this.state.titleErr}</span>
                        <input type="text" 
                            id="title" 
                            aria-required="true"
                            aria-invalid={invalidTitle ? "true" : "false"} 
                            className="form-control" 
                            placeholder="Title for Feature Request" 
                            value={this.state.title} onChange={this.handleTitleChange.bind(this)}
                            ref={function(input) {
                              if (input != null && invalidTitle) {
                                console.log("There is a title error.")
                                input.focus();
                              }
                            }}/>
        
                    </div>
                    <div className={"form-group" + (invalidCategory ? " has-warning" : "")}>
                        <label htmlFor="categories">Categories</label>
                        <span className="errorMsg" role={invalidCategory ? "alert" : ""}>{this.state.catErr}</span>
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
                     <div className={"form-group" + (invalidText ? " has-warning" : "")}>
                        <label htmlFor="text">Description</label>
                        <span className="errorMsg" role={invalidText ? "alert" : ""}>{this.state.textErr}</span>
                        <textarea id="text"
                                aria-required="true"
                                aria-invalid={invalidText ? "true" : "false"}  
                                rows="15" 
                                className="form-control" 
                                placeholder="Describe feature..." 
                                value={this.state.text} 
                                onChange={this.handleTextChange.bind(this)}
                                ref={function(ta) {
                                if (ta != null && invalidText) {
                                        console.log("There is a text error.")
                                        ta.focus();
                                      }
                                }}>
                        </textarea>
                    </div>
                    {this.props.editMode ? 
                        <div className={"form-group" + (invalidStage ? " has-warning" : "")}>
                            <div className="errorMsg" role={invalidStage ? "alert" : ""}>{this.state.stageErr}</div>
                            <label htmlFor="stage">Stage</label>
                            <select id="stage" 
                                    onChange={this.handleStageChange.bind(this)} 
                                    value={this.state.stage}
                                    ref={function(select){
                                        if(select != null && invalidStage){
                                            console.log("There is a stage error");
                                            select.focus();
                                        }
                                    }}>
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