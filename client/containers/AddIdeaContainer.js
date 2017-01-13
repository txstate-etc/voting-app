import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import {fetchCategories} from '../actions/category-actions'
import IdeaForm from '../components/IdeaForm.jsx'
import fetch from 'isomorphic-fetch';
import {parseJSON, handleErrors} from '../util'

class AddIdeaContainer extends Component{

    loadData(){
        this.props.fetchCategories();
    }

    componentWillMount(){
        this.loadData();
    }

    submit(formData){
        var agreement = confirm("By submitting this idea you agree that you may be contacted by a moderator");
        if(agreement){
            var fd = new FormData();
            fd.append('title', formData.title);
            fd.append('text', formData.text);
            fd.append('category', formData.categories);
            fd.append('views', 0);
            if(formData.attachments)
                for(var i=0; i<formData.attachments.length; i++){
                    fd.append('attachments', formData.attachments[i], formData.attachments[i].name);
                }
            
            fetch("/ideas", {
              method: "POST",
              body: fd,
              credentials: 'include'
            })
            .then(handleErrors)
            .then(parseJSON)
            .then(result => {
                browserHistory.push('/new/confirm');
            })
            .catch(function(err){
                console.log(err)
            })
        }
    }

    render(){
        return(
            <IdeaForm editMode={false} categories={this.props.categories} onIdeaSubmit = {this.submit.bind(this)}/>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    categories: state.categoryState.categories
  }
}

export default connect(mapStateToProps, {
  fetchCategories
})(AddIdeaContainer)