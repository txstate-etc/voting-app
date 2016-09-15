import React from 'react';
import Idea from './Idea.jsx';

class IdeaList extends React.Component {
    render(){
        return(
            <div>
                {this.props.ideaList.map(idea => {
                    return (
                        <Idea
                            key = {idea.id}
                            idea = {idea}
                        />
                    )
                })}
            </div>
        );
    }
}

export default IdeaList;