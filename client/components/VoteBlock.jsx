import React from 'react';

class VoteBlock extends React.Component {

    updateVote(e){
        this.props.updateVote(e.target.value);
    }
    
    render(){
        return(
            <div>
                <div className="vote-count-box text-center">
                    <div className="vote-count">{this.props.totalScore}</div>
                </div>
                <div className="voting-buttons">
                    <button className="btn btn-xs btn-warning" value="1" onClick={this.updateVote.bind(this)}>
                        <i className="icon fa fa-thumbs-up"></i>
                    </button>
                    <button className="btn btn-xs btn-warning" value="-1" onClick={this.updateVote.bind(this)}>
                        <i className="icon fa fa-thumbs-down"></i>
                    </button>
                </div>
            </div>
    

        )
    }
}

export default VoteBlock;