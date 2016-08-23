import React from 'react';
import ViewIdea from './ViewIdea.jsx';
import $ from 'jquery';
import {sumCommentsAndReplies} from '../util';
import {getIcons} from '../IconGenerator';

class ViewIdeaContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            idea: {
                comments: []
            },
            iconList: []
        };
    }

    componentDidMount() {
        var _this = this;
        var url = "/ideas/" + this.props.params.ideaId
        $.ajax({url: url, dataType: "json", success: function(result){
           _this.setState({idea: result})
           var contributors = _this.getUniqueContributors(result.comments);
           var icons = getIcons(contributors.length);
           var iconAssignments = icons.map(function(icon, index){
            var returnObject = icon;
            icon.id = contributors[index];
            return returnObject;
           });
           _this.setState({iconList: iconAssignments});
        }});
    }

    getUniqueContributors(comments){
        var uniqueContributors = [];
        $.each(comments, function(i, comment){
            if($.inArray(comment.user_id, uniqueContributors) === -1) uniqueContributors.push(comment.user_id);
            $.each(comment.replies, function(j, reply){
                if($.inArray(reply.user_id, uniqueContributors) === -1) uniqueContributors.push(reply.user_id);
            });
        });
        return uniqueContributors
    }


    //for some reason, getting the Idea ID from the idea prop in ViewIdea was not working
    //It said it was "undefined."  Passing it in its own prop works.
    render(){
        return(
            <ViewIdea
                idea = {this.state.idea}
                id = {this.props.params.ideaId}
                commentCount = {sumCommentsAndReplies(this.state.idea.comments)}
                iconList = {this.state.iconList}
            />
        );
    }
}

export default ViewIdeaContainer;