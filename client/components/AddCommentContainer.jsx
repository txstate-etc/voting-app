import React from 'react';
import AddComment from './AddComment.jsx'
import $ from 'jquery';

class AddCommentContainer extends React.Component {

    submit(formData){
      var data = {
        text: formData.text,
        idea_id: this.props.ideaID
      };
      var _this = this;
      $.post( "/comments", data, function( result ) {
        $.ajax({
          url: "/comments?replies=true&idea=" + _this.props.ideaID,
          dataType: "json",
          success: function(comments){
            _this.props.updateCommentList(comments);
          },
          error: function(){

          }
        })
      }, "json");
    }
    
    render(){
        var jsx = this.props.loggedIn? 
              <AddComment
                ideaID = {this.props.ideaID}
                onCommentSubmit = {this.submit.bind(this)}
              />
              :
              <span>Please log in to make a comment</span>;
          
        return(jsx);
    }
}

export default AddCommentContainer;