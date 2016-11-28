import React from 'react';
import AddComment from './AddComment.jsx'
import $ from 'jquery';

class AddReplyContainer extends React.Component {

    submit(formData){
      var data = {
        text: formData.text,
        comment_id: this.props.comment_id
      };
       var _this = this;
      $.post( "/replies", data, function( result ) {
        $.ajax({
          url: "/comments?replies=true&idea=" + _this.props.idea_id,
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
              onCommentSubmit = {this.submit.bind(this)}
              focus = {true}
            />
          :
          <div/>
        return(jsx);
    }
}

export default AddReplyContainer;