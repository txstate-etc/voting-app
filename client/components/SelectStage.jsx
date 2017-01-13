import React from 'react';

class SelectStage extends React.Component {

    handleSelection(e){
        this.props.updateStage(e.target.value);
    }

    render(){
        var  options = [{"id": 0, "name": "- select -"}].concat(this.props.options);
        return(
            <select onChange={this.handleSelection.bind(this)} id="stage">
                {
                    options.map(option => {
                        return(
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        )
                    })
                }
            </select>
        )
    }
}

export default SelectStage;