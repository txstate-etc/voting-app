import React from 'react';
import AddComment from './AddComment.jsx'
import $ from 'jquery';

class AddReplyContainer extends React.Component {

    submit(formData){
      //TODO: Get the user ID from somewhere.  
      var data = {
        text: formData.text,
        comment_id: this.props.comment_id
      };
      $.post( "/replies", data, function( result ) {
        //display a message that the comment will be displayed after it has been approved
      });
    }
    
    render(){
        var jsx = this.props.loggedIn?
          <AddComment
              onCommentSubmit = {this.submit.bind(this)}
            />
          :
          <div/>
        return(jsx);
    }
}

export default AddReplyContainer;