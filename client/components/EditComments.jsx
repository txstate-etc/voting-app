import React from 'react';
import $ from 'jquery';
import EditComment from './EditComment.jsx'

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

    updateComments(idea_id){
        console.log("Updating comments for idea " + idea_id)
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
                                <EditComment comment={comment} key={comment.id} updateComments={this.updateComments.bind(this)}/>
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