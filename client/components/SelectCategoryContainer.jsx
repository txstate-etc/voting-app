import React from 'react';
import SelectField from './SelectField.jsx';
import $ from 'jquery';

class SelectCategoryContainer extends React.Component{

    constructor(props) {
        super(props);
        this.state = {options:[]};
    }

    componentDidMount() {
        var _this = this;
        $.ajax({url: "/categories", dataType: "json", success: function(result){
            result.unshift({"id": 0, "name": "All"});
            _this.setState({options: result});
        }});
    }

    render(){
        return(
            <SelectField 
                options= {this.state.options}
                update = {this.props.updateCategory}
                selectID = "category"
            />
        );
    }
}

export default SelectCategoryContainer;