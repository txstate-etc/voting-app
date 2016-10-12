import React from 'react';
import ShowIdea from './ShowIdea.jsx';
import $ from 'jquery';
import {sumCommentsAndReplies} from '../util';
import {getIcons} from '../IconGenerator';
import {isLoggedIn} from '../auth';


class ShowIdeaContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            idea: {
                comments: [],
                files: [],
                categories: []
            },
            iconList: [],
            loggedIn: false
        };
    }

    componentDidMount() {
        var _this = this;
        var url = "/ideas/" + this.props.params.ideaId + "?files=true";
        this.setState({loggedIn: isLoggedIn()});
        $.ajax({url: url, dataType: "json", success: function(result){
           _this.setState({idea: result})
        
           var contributors = _this.getUniqueContributors(result.comments);
           var iconAssignments = getIcons(contributors, result.id);
           _this.setState({iconList: iconAssignments});
           //update view count
           $.ajax({
                url: url,
                dataType: "json",
                type: "PUT",
                data: {views: parseInt(result.views) + 1},
                success: function(){  
                },
                error: function(xhr, status, err){
                    console.log("there was an error")
                }
            })
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

    render(){
        return(
            <ShowIdea
                idea = {this.state.idea}
                id = {this.props.params.ideaId}
                commentCount = {sumCommentsAndReplies(this.state.idea.comments)}
                iconList = {this.state.iconList}
                loggedIn = {this.state.loggedIn}
            />
        );
    }
}

export default ShowIdeaContainer;