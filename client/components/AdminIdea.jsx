import React from 'react';
import { Link } from 'react-router'
import Linkify from 'react-linkify'
import {sumCommentsAndReplies} from '../util'

class AdminIdea extends React.Component{

    deleteIdea(){

    }

    buildIdea(idea, index){
        return(
            <div>
                <Link to={"/admin/ideas/" + idea.id}><h4>{idea.title}</h4></Link>
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
        var index=this.props.index;
        var idea=this.props.idea;
        return(
            <div className={"row edit-ideas" + ((index%2 == 0) ? " idea-table-row-stripe" : "")} key={idea.id}>
                <div className="col-sm-2">
                    <span className="data-label">Stage:</span>{idea.stage ? idea.stage.name : <span className="new-indicator">NEW</span>}
                </div>
                <div className="col-sm-2">
                    <span className="data-label">Category:</span>
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
                    <span className="data-label">Delete?</span>
                    <input type="checkbox" id={idea.id} onClick={this.deleteIdea.bind(this,idea.id)}/>
                </div>
            </div>
        )
    }
}

export default AdminIdea