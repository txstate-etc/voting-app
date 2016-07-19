import React from 'react';
import Idea from './Idea.jsx';
//this container might be unnecessary.  The only things that will change based on state
//are the buttons and the number of votes
class IdeaContainer extends React.Component {

    render(){
        return(
            <Idea
                idea={this.props.idea}
            />
        )
    }
    
}

export default IdeaContainer;