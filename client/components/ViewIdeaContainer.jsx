import React from 'react';
import ViewIdea from './ViewIdea.jsx';
import $ from 'jquery';

class ViewIdeaContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            idea: {
                comments: []
            }
        };
    }

    sumComments(comments){
        if(comments){
            var sum=comments.length;
            for(var i=0; i<comments.length; i++){
                sum += comments[i].replies.length;
            }
            return sum;
        }
        return 0;
    }

    componentDidMount() {
        var _this = this;
        var url = "/ideas/" + this.props.params.ideaId
        $.ajax({url: url, dataType: "json", success: function(result){
           _this.setState({idea: result})
        }});
    }
    //for some reason, getting the Idea ID from the idea prop in ViewIdea was not working
    //It said it was "undefined."  Passing it in its own prop works.
    render(){
        return(
            <ViewIdea
                idea = {this.state.idea}
                id = {this.props.params.ideaId}
                commentCount = {this.sumComments(this.state.idea.comments)}
            />
        );
    }
}

export default ViewIdeaContainer;