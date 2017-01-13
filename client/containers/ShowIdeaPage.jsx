import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import {getIdea} from '../actions/idea-actions'
import ShowIdeaContainer from './ShowIdeaContainer.jsx';

class ShowIdeaPage extends React.Component {

    loadData() {
        this.props.getIdea(this.props.params.idea_id, true)
    }

    componentWillMount(){
        this.loadData()
    }

    render(){
        return(
            <div className="container">
                <ShowIdeaContainer idea_id={this.props.params.idea_id}/>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
    
  }
}

export default connect(mapStateToProps, {
  getIdea,
})(ShowIdeaPage)