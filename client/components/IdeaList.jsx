import React from 'react';
import Idea from './Idea.jsx';

class IdeaList extends React.Component {
    render(){
        return(
            <div>
                {
                    this.props.ideas.result.map(id => {
                        var idea = this.props.ideas.entities.ideas[id]
                        return (
                            <Idea
                                key = {idea.id}
                                idea = {idea}
                            />
                        )
                    })
                }
            </div>
        );   
    }
}

export default IdeaList;