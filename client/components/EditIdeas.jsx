import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import {sumCommentsAndReplies} from '../util';

class EditIdeas extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            ideas: [],
            ideasToDelete: []
        };
    }

    componentDidMount(){
        var _this = this;
        $.ajax({url: "/ideas?files=true", dataType: "json", success: function(result){
            console.log("got ideas")
            _this.setState({ideas: result});
        }});
    }

    deleteIdea(id, e){
        var deleteList = this.state.ideasToDelete.slice(0);
        if(e.target.checked){
            deleteList.push(id);
            this.setState({ideasToDelete: deleteList});
        }
        else{
            this.removeFromDeleteList(id);
        }
    }

    removeFromDeleteList(id){
        var deleteList = this.state.ideasToDelete.slice(0);
        var index = deleteList.indexOf(id);
        if(index > -1){
            deleteList.splice(index, 1);
        }
        this.setState({ideasToDelete: deleteList});
    }

    handleDeletions(){
        var _this = this;
        var count = this.state.ideasToDelete.length;
        var confirmationMessage = "Delete " + count + " idea" + ((count == 1) ? "?" : "s?");
        if(confirm(confirmationMessage)){
            var deletions = this.state.ideasToDelete.map(function (id) { 
                return $.ajax({
                    url: "/ideas/" + id,
                    method: 'DELETE',
                    dataType: "json",
                    success: function(result){
                        //remove idea from display list
                        var ideas = _this.state.ideas.filter(function(idea){
                            return idea.id != id;
                        })
                        _this.setState({ideas: ideas});
                        //clear from list of items to be deleted
                        _this.removeFromDeleteList(id);
                    }
                }); 
            });

        }
    }

    buildIdea(idea, index){
        return(
            <div>
                <Link to={"/edit/" + idea.id}><h4>{idea.title}</h4></Link>
                <p>{idea.text}</p>
                <div className="row">
                    <div className="col-lg-3 col-md-6">
                        <span className="idea-creator"><span className="idea-small-label">Created by:</span> {idea.user.netid}</span>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <span><span className="idea-small-label">Views:</span>{idea.views + " "}</span>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <span><span className="idea-small-label">Comments:</span>{sumCommentsAndReplies(idea.comments)}</span>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <span> <span className="idea-small-label">Attachments:</span>{idea.files.length}</span>
                    </div>
                </div>
            </div>
        )
    }

    render(){
        return(
            <div>
                <h3>Ideas</h3>
                <div className="row idea-table-header">
                    <div className="col-sm-2">
                        Stage
                    </div>
                    <div className="col-sm-2">
                        Category
                    </div>
                    <div className="col-sm-7">
                        Idea
                    </div>
                    <div className="col-sm-1">
                        Delete
                    </div>
                </div>
                {
                    this.state.ideas.map((idea, index) => {
                        return(
                            <div className={"row edit-ideas" + ((index%2 == 0) ? " idea-table-row-stripe" : "")} key={idea.id}>
                                <div className="col-sm-2">
                                    {idea.stage ? idea.stage.name : <span className="new-indicator">NEW</span>}
                                </div>
                                <div className="col-sm-2">
                                    <div>
                                    {
                                        idea.categories.map((cat) => {
                                            return(
                                                <div key={cat.id}>
                                                    {cat.name}
                                                </div>
                                            );
                                        })
                                    }
                                    </div>
                                </div>
                                <div className="col-sm-7">
                                    {this.buildIdea(idea)}
                                </div>
                                <div className="col-sm-1">
                                    <input type="checkbox" id={idea.id} onClick={this.deleteIdea.bind(this,idea.id)}/>
                                </div>
                            </div>
                        )
                    })
                }
                <div className={"row edit-ideas" + ((this.state.ideas.length%2 ==0) ? " idea-table-row-stripe" : "" )}>
                    <div className="col-xs-12">
                        <a className="btn btn-warning btn-sm" href="/new">Add Idea</a>
                    </div>
                </div>
                { this.state.ideasToDelete.length > 0 && <button className="btn btn-warning btn-sm pull-right" onClick={this.handleDeletions.bind(this)}>Delete Selected Ideas</button>}
            </div>
        );
    }
}

export default EditIdeas;