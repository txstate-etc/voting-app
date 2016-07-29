import React from 'react';
import AddIdea from './AddIdea.jsx';
import $ from 'jquery';

class AddIdeaContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories:[]
        };
    }

    submit(formData){
        //TODO: Get the user ID from somewhere.  The cookie?  Redux?
        var data = {
            title: formData.title,
            text: formData.text,
            category: formData.categories,
            views: 0,
            creator: 17
        };
        //Without this, jQuery sends the categories as "category[]"
        $.ajaxSettings.traditional = true;
        $.post( "/ideas", data, function( result ) {
            //display a message that the idea will be displayed after it has been approved
        });
    }

    componentDidMount() {
        var _this = this;
        $.ajax({url: "/categories", dataType: "json", success: function(result){
            _this.setState({categories: result});
        }});
    }

    render(){
        return (
            <AddIdea
                categories= {this.state.categories}
                onIdeaSubmit = {this.submit.bind(this)}
            />
        );
    }
}

export default AddIdeaContainer;