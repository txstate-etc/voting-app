import React from 'react';
import { connect } from 'react-redux'
import AddComment from '../components/AddComment.jsx'
import {addReply} from '../actions/comment-actions'

class AddReplyContainer extends React.Component{

    submit(formData){
         this.props.addReply(this.props.comment_id, formData.text, this.props.author)
    }

    render(){
        var jsx = this.props.loggedIn?
          <AddComment
              onCommentSubmit = {this.submit.bind(this)}
              focus = {true}
            />
          :
          <div/>
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
   addReply
})(AddReplyContainer);