import React from 'react';
import IdeaForm from './IdeaForm.jsx';
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
        var fd = new FormData();
        fd.append('title', formData.title);
        fd.append('text', formData.text);
        fd.append('category', formData.categories);
        fd.append('views', 0);
        if(formData.attachment)
            for(var i=0; i<formData.attachment.length; i++){
                fd.append('attachment', formData.attachment[i], formData.attachment[i].name);
            }
        
        //Without this, jQuery sends the categories as "category[]"
        $.ajaxSettings.traditional = true;
        $.ajax({
            url: "/ideas",
            method: "POST",
            contentType: false,
            processData: false,
            data: fd,
            success: function(result){
                browserHistory.push('/new/confirm');
            },
            error: function(xhr, status, err){
                //this should never happen because the user can't see this page unless they are logged in
                if(xhr.status == 302){
                    browserHistory.push('/login')
                }
            }
        }) 
    }

    componentDidMount() {
        var _this = this;
        $.ajax({url: "/categories", dataType: "json", success: function(result){
            _this.setState({categories: result});
        }});
    }

    render(){
        return (
            <IdeaForm
                categories= {this.state.categories}
                onIdeaSubmit = {this.submit.bind(this)}
                editMode = {false}
            />
        );
    }
}

export default AddIdeaContainer;