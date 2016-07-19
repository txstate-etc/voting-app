import React from 'react';

class SelectField extends React.Component{

    handleSelection(e){
        this.props.update(e.target.value);
    }

    render(){
        return(
            <select onChange={this.handleSelection.bind(this)} id={this.props.selectID}>
                {this.props.options.map(option => {
                    return (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    )
                })}
            </select>
        );
    }
}

export default SelectField;