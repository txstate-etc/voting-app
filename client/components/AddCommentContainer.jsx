import React from 'react';
import AddComment from './AddComment.jsx'
import $ from 'jquery';

class AddCommentContainer extends React.Component {

    submit(formData){
      //TODO: Get the user ID from somewhere.  The cookie?  Redux?
      var data = {
        text: formData.text,
        idea_id: this.props.ideaID
      };
      $.post( "/comments", data, function( result ) {
        //display a message that the comment will be displayed after it has been approved
      });
    }
    
    render(){
        return(
            <AddComment
              ideaID = {this.props.ideaID}
              onCommentSubmit = {this.submit.bind(this)}
            />
        );
    }
}

export default AddCommentContainer;