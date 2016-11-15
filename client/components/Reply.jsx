import React from 'react';
import {dateToElapsedTime} from '../util';
import $ from 'jquery';

class Reply extends React.Component {

    flagComment(id){
        $.ajax({
            url: "/replies/" + id,
            dataType: "json",
            type: 'PUT',
            data: {'flagged': true},
            success: function(){
              alert("Thank you for bringing this to our attention.")  
            },
            error: function(xhr, status, err){
                console.log("there was an error")
            }
        })
    }


    render(){
        var timeElapsed = dateToElapsedTime(this.props.reply.updated_at)

        var icon = this.props.icon;
        if(this.props.reply.user.affiliation === "moderator"){
            icon.icon = "fa-lock";
            icon.color = "";
        }
        return(
            <div className="media">
                <div className="media-left">
                  <i aria-label={"Reply from " + this.props.reply.user.affiliation + " " + icon.aria_id}className={"avatar fa " + icon.icon + " " + icon.color }></i>
                </div>
                <div className="media-body">
                    <div className="media-heading">
                        <p className="comment-title">{this.props.reply.user.affiliation}</p>
                        <span className="comment-age">{timeElapsed}</span>
                    </div>
                    <p>{this.props.reply.text}</p>
                    <div><a className="flag" onClick={this.flagComment.bind(this, this.props.reply.id)}><i className="fa fa-flag-o"></i>Flag Comment</a></div>
                </div>
          </div>
        );
    }
}

export default Reply;