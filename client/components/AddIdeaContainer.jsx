import React from 'react';
import AddIdea from './AddIdea.jsx';
import $ from 'jquery';
import {isLoggedIn,getUserId} from '../auth';
import { browserHistory } from 'react-router';

class AddIdeaContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories:[]
        };
    }

    submit(formData){
        var data = {
            title: formData.title,
            text: formData.text,
            category: formData.categories,
            views: 0
        };
        //Without this, jQuery sends the categories as "category[]"
        $.ajaxSettings.traditional = true;
        $.post( "/ideas", data, function( result ) {
            browserHistory.push('/new/confirm')
        })
        .fail(function(xhr, status, err){
            //this should never happen because the user can't see this page unless they are logged in
            if(xhr.status == 302){
                browserHistory.push('/login')
            }
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