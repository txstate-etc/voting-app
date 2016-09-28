import React from 'react';
import $ from 'jquery';
import Dropzone from 'react-dropzone';
import {getUserId, isAdmin} from '../auth';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';

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
            attachmentID: 0,
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
                if(isAdmin() || result.creator == getUserId()){
                    _this.setState({title: result.title,
                                    text: result.text,
                                    categories: _this.formatCategories(result.categories),
                                    stage: result.stage_id || 0,
                                    attachmentsAlreadyUploaded: result.files
                                });
                }
                else{
                    //They should not be editing this idea, show them not found page
                    browserHistory.push('/notfound')
                }
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

    updateAttachments(file){
        var fileWithId = file[0];
        fileWithId.id = this.state.attachmentID;
        this.setState({attachmentID: fileWithId.id + 1})
        var uploadList = update(this.state.attachmentsToUpload, {$push: [fileWithId]})
        this.setState({attachmentsToUpload: uploadList })
    }

    removeSelectedAttachment(id, e){
        e.preventDefault();
        var del = confirm("Are you sure you want to delete this attachment?");
        if(del){
            var selectedAttachments = this.state.attachmentsToUpload.filter(function(attachment){
                return attachment.id != id;
            })
            this.setState({attachmentsToUpload: selectedAttachments});
        }
    }

    deleteSavedAttachment(id, e){
        e.preventDefault();
        var del = confirm("Are you sure you want to delete this attachment?");
        if(del){
            var deleteList = this.state.attachmentsToDelete.slice(0);
            deleteList.push(id);
            this.setState({attachmentsToDelete: deleteList});
            var uploadedList = this.state.attachmentsAlreadyUploaded.filter(function(attachment){
                return attachment.id != id;
            })
            this.setState({attachmentsAlreadyUploaded: uploadedList});
        }
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
                <div className="row" key={i}>
                    <div className="col-xs-3">
                        {this.state.attachmentsToUpload[i].name}
                    </div>
                    <div className="col-xs-7 pull-left">
                        <a href="#" onClick={this.removeSelectedAttachment.bind(this, this.state.attachmentsToUpload[i].id )}><i className="fa fa-trash"></i></a>
                    </div>
                </div>
            )
        }
        var savedAttachments = [];
        for(var i=0; i<this.state.attachmentsAlreadyUploaded.length; i++){
            savedAttachments.push(
                <div className="row" key={i}>
                    <div className="col-xs-3">
                        {this.state.attachmentsAlreadyUploaded[i].filename}
                    </div>
                    <div className="col-xs-7 pull-left">
                        <a href="#" onClick={this.deleteSavedAttachment.bind(this, this.state.attachmentsAlreadyUploaded[i].id)}><i className="fa fa-trash"></i></a>
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
            <div>
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
                        <div>
                            {savedAttachments}
                        </div>
                        <div>
                            {selectedAttachments}
                        </div>
                        <div>
                            <Dropzone className="attachment-dropzone" multiple={false} onDrop={this.updateAttachments.bind(this)}>
                              <div>Drop files here or click to select files</div>
                            </Dropzone>
                        </div>
                    </div>                    
                    <button type="submit" className="btn btn-warning pull-right">Submit Feature</button>
                </form>
            </div>
        );
    }
}

export default IdeaForm;