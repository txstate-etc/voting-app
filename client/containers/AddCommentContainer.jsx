import React from 'react';
import { connect } from 'react-redux'
import AddComment from '../components/AddComment.jsx'
import {addComment} from '../actions/comment-actions'

class AddCommentContainer extends React.Component {

    submit(formData){
      this.props.addComment(this.props.idea_id, formData.text, this.props.author)
    }
    
    render(){
        var jsx = this.props.loggedIn? 
              <div><AddComment focus={false} onCommentSubmit={this.submit.bind(this)}/></div>
              :
              <span>Please log in to make a comment</span>;
          
        return(jsx);
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loggedIn: state.authState.isLoggedIn,
    author: {id: state.authState.userid, affiliation: state.authState.affiliation}
  }
}

export default connect(mapStateToProps, {
   addComment
})(AddCommentContainer);