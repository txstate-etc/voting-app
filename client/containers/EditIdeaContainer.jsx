import React from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import {fetchCategories} from '../actions/category-actions'
import {fetchStages} from '../actions/stage-actions'
import {getIdea} from '../actions/idea-actions'
import {getIdea as getIdeaSelector} from '../selectors/ideaSelectors'
import IdeaForm from '../components/IdeaForm.jsx'
import fetch from 'isomorphic-fetch';
import {parseJSON, handleErrors} from '../util'

class EditIdeaContainer extends React.Component{

    loadData(){
        this.props.fetchCategories();
        this.props.fetchStages();
        this.props.getIdea(this.props.params.idea_id)
    }

    componentWillMount(){
        this.loadData();
    }

    submit(formData){
        var data = new FormData();
        data.append('title', formData.title);
        data.append('text', formData.text);
        data.append('category', formData.categories);
        data.append('stage_id', formData.stage);
        if(formData.attachments){
            for(var i=0; i<formData.attachments.length; i++){
                data.append('attachments', formData.attachments[i], formData.attachments[i].name);
            }
        }
        if(formData.deleteAttachments.length > 0){
            data.append('deleteAttachments', formData.deleteAttachments);
        }
        fetch("/ideas/" + this.props.params.idea_id, {
          method: "PUT",
          body: data,
          credentials: 'include'
        })
        .then(handleErrors)
        .then(parseJSON)
        .then(result => {
            browserHistory.push('/admin')
        })
        .catch(err => {
            //maybe there should be an error page
        });
    }

    render(){
        return(
            <IdeaForm editMode={true} categories={this.props.categories} stages={this.props.stages} idea={this.props.idea} onIdeaSubmit = {this.submit.bind(this)}/>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    var idea_id = ownProps.params.idea_id;
  return {
    categories: state.categoryState.categories,
    idea: getIdeaSelector(state, {idea_id: idea_id}),
    stages: state.stageState.stages
  }
}

export default connect(mapStateToProps, {
  fetchCategories,
  fetchStages,
  getIdea
})(EditIdeaContainer)