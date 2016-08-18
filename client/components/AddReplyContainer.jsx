import React from 'react';
import AddComment from './AddComment.jsx'
import $ from 'jquery';

class AddReplyContainer extends React.Component {

    submit(formData){
      //TODO: Get the user ID from somewhere.  
      var data = {
        text: formData.text,
        comment_id: this.props.comment_id,
        user_id: 17 
      };
      $.post( "/replies", data, function( result ) {
        //display a message that the comment will be displayed after it has been approved
      });
    }
    
    render(){
        return(
            <AddComment
              onCommentSubmit = {this.submit.bind(this)}
            />
        );
    }
}

export default AddReplyContainer;