import React from 'react';

class SelectCategory extends React.Component {

    handleSelection(e){
        this.props.updateCategory(e.target.value);
    }

    render(){
        var options;
        if(this.props.addAllOption){
            options = [{"id": 0, "name": "All"}].concat(this.props.options);
        }
        else{
            options = [{"id": 0, "name": "- select -"}].concat(this.props.options);
        }
        return(
            <select onChange={this.handleSelection.bind(this)} id="category">
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

export default SelectCategory;