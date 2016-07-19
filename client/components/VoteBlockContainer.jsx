import React from 'react';
import VoteBlock from './VoteBlock.jsx';
import $ from 'jquery';

class VoteBlockContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            totalScore: 0,
            userScore: 0 //in order to get the userScore, I need the id of the user logged in
        };
    }

    componentDidMount() {
        var _this = this;
        $.ajax({url: "/votes?idea=" + this.props.ideaID, dataType: "json", success: function(result){
            _this.setState({totalScore: _this.calculateScore(result)});
            //check the result for a vote from the logged-in user and set userScore if there is a vote
        }});
       
    }

    updateVote(score){
        console.log("voted with a score of " + score);
        //send vote to the DB
        //update totalScore state
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
            />
        )
    }
}

export default VoteBlockContainer;