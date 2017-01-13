import React, { PropTypes } from 'react';
import VoteBlock from '../components/VoteBlock.jsx';
import { connect } from 'react-redux'
import {getVoteTotal, getUserScore} from '../selectors/ideaSelectors';
import {addVote, deleteVote} from '../actions/voting-actions'

class VoteBlockContainer extends React.Component {

    updateVote(score){
        var _this = this;
        if(score == this.props.userScore){
            this.props.deleteVote(this.props.idea_id, this.props.user_id)
        }
        else{
            this.props.addVote(this.props.idea_id, score)
        }
    }

    render(){
        return(
            <VoteBlock
                totalScore = {this.props.totalScore}
                updateVote = {this.updateVote.bind(this)}
                userScore = {this.props.userScore}/>
        )
    }

    
}

const mapStateToProps = (state, ownProps) => {
        return {
            totalScore: getVoteTotal(state, ownProps),
            userScore: getUserScore(state, ownProps),
            user_id: state.authState.userid
          }
    }

VoteBlockContainer.propTypes = {
  idea_id: PropTypes.number.isRequired
}

export default connect(mapStateToProps, {
    addVote,
    deleteVote
})(VoteBlockContainer);
