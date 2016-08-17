import React from 'react';

class VoteBlock extends React.Component {

    updateVote(score, evt){
        this.props.updateVote(score)
    }
    
    render(){
        var upvoted = (this.props.userScore == 1) ? " selected" : "";
        var downvoted = (this.props.userScore == -1) ? " selected" : "";
        return(
            <div>
                <div className="vote-count-box text-center">
                    <div className="vote-count">{this.props.totalScore}</div>
                </div>
                <div className="voting-buttons">
                    <button aria-label={"Vote for idea " + upvoted} className={"btn btn-xs btn-warning " + upvoted} value="1" onClick={this.updateVote.bind(this, 1)}>
                        <i className="icon fa fa-thumbs-up"></i>
                    </button>
                    <button aria-label={"Vote against idea " + downvoted} className={"btn btn-xs btn-warning " + downvoted} value="-1" onClick={this.updateVote.bind(this, -1)}>
                        <i className="icon fa fa-thumbs-down"></i>
                    </button>
                </div>
            </div>
    

        )
    }
}

export default VoteBlock;