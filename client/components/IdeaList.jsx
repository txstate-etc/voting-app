import React from 'react';
import IdeaContainer from './IdeaContainer.jsx';

class IdeaList extends React.Component {
    render(){
        return(
            <div>
                {this.props.ideaList.map(idea => {
                    return (
                        <IdeaContainer
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