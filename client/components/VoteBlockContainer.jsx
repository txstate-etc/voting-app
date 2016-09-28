import React from 'react';
import VoteBlock from './VoteBlock.jsx';
import $ from 'jquery';
import { browserHistory } from 'react-router';

class VoteBlockContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            totalScore: 0,
            userScore: 0
        };
    }

    componentDidMount() {
        var _this = this;
        $.ajax({url: "/votes?idea=" + _this.props.ideaID, dataType: "json", success: function(results){
            _this.setState({totalScore: _this.calculateScore(results)});
            if(_this.props.auth.loggedIn){
                var user_vote = results.filter((vote) => vote.user_id === _this.props.auth.userId);
                if(user_vote.length > 0){
                    _this.setState({userScore: user_vote[0].score});
                }
            }
        }});
    }

    updateVote(score){
        var _this = this;
        if(score == this.state.userScore){
            //If the user votes and then repeats the same vote, remove the vote
           $.ajax({url: "/votes?idea=" + this.props.ideaID + "&user=" + this.props.auth.userId, dataType: "json", success: function(result){
               if(result.length > 0){
                    var voteId = result[0].id;
                    $.ajax({
                        type: "DELETE",
                        url: "/votes/" + voteId,
                        dataType: "json",
                        success: function(){
                            _this.setTotalScore();
                            _this.setState({userScore: 0})
                        }
                    })
               }
            }});
        }
        else{
            //they are changing their vote or adding a new vote
            var data= { idea_id: this.props.ideaID,
                        score: score }
            $.ajax({
              type: "POST",
              url: "/votes",
              data: data,
              success: function(){
                _this.setTotalScore();
                _this.setState({userScore: score});
              },
              error: function(xhr, status, err){
                    //They have to be logged in to vote
                    if(xhr.status == 302){
                        browserHistory.push('/login')
                    }
                }
            });
        }
    }

    setTotalScore(){
        var _this = this;
        $.ajax({url: "/votes?idea=" + _this.props.ideaID, dataType: "json", success: function(result){
            _this.setState({totalScore: _this.calculateScore(result)});
        }});
    }

    calculateScore(votes) {
        return votes.reduce(function(prev, cur){
            return prev + cur.score;
        },0);
    }
    
    render(){
        return(
            <VoteBlock
                totalScore = {this.state.totalScore} 
                updateVote = {this.updateVote.bind(this)}
                userScore = {this.state.userScore}
            />
        )
    }
}

export default VoteBlockContainer;