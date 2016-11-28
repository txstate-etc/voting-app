import React from 'react';
import $ from 'jquery';
import EditComment from './EditComment.jsx';
import update from 'react-addons-update';

class EditComments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           idea: {
                comments: [],
                files: []
            }
        };
    }

    updateCommentState(id){
        var _this = this;
        $.ajax({
            url: "/comments/" + id,
            dataType: "json", 
            success: function(comment){
                var comments = _this.state.idea.comments;
                var commentIndex = comments.findIndex(function(c){
                    return c.id == id;
                });
                var updatedComment = update(comments[commentIndex], {text: {$set: comment.text}, 
                                                                        flagged: {$set: comment.flagged}, 
                                                                        edited: {$set: comment.edited} });
                var newComments = update(comments, {$splice: [[commentIndex, 1, updatedComment]]});
                var idea = update(_this.state.idea, {$merge: {comments: newComments}});
                _this.setState({idea: idea});
            } 
        })
    }

    removeComment(id){
        var comments = this.state.idea.comments;
        var commentIndex = comments.findIndex(function(c){
            return c.id == id;
        });
        var newComments = update(comments, {$splice: [[commentIndex, 1]]});
        var idea = update(this.state.idea, {$merge: {comments: newComments}});
        this.setState({idea: idea});
    }

    componentDidMount(){
        var _this = this;
        $.ajax({url: "/ideas/" + _this.props.params.ideaId, dataType: "json", success: function(result){
            _this.setState({idea: result});
        }});
    }

    render(){
        var idea = this.state.idea;
        return(
            <div>
                <div className="row">
                    <div className="col-sm-2 show-label">Idea Title:</div>
                    <div className="col-sm-10">{idea.title}</div>
                </div>
                <div className="row top-buffer">
                    <div className="col-sm-2 show-label">Idea Description:</div>
                    <div className="col-sm-10">{idea.text}</div>
                </div>
                <div className="top-buffer comment-list">
                    <ul className="media-list">
                    {
                        idea.comments.map(comment => {
                            return(
                                <EditComment comment={comment} key={comment.id} removeComment={this.removeComment.bind(this)} updateCommentState={this.updateCommentState.bind(this)}/>
                            )
                        })
                    }
                    </ul>
                </div>
            </div>
        );
    }
}

export default EditComments;