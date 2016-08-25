import React from 'react';
import IdeaForm from './IdeaForm.jsx';
import $ from 'jquery';
import {isLoggedIn,getUserId} from '../auth';
import { browserHistory } from 'react-router';

class EditIdeaContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories:[],
            stages:[]
        };
    }

    submit(formData){
        var data = {
            title: formData.title,
            text: formData.text,
            category: formData.categories,
            views: 0, 
            stage_id: formData.stage
        };
        //Without this, jQuery sends the categories as "category[]"
        var _this = this;
        $.ajaxSettings.traditional = true;
        $.ajax({
            url: "/ideas/" + _this.props.params.ideaId,
            type: 'PUT',
            data: data,
            success: function(){
                browserHistory.push('/admin')
            },
            error : function(xhr, status, err){
                //this should never happen because the user can't see this page unless they are logged in
                if(xhr.status == 302){
                    browserHistory.push('/login')
                }
            }   
        });
    }

    componentDidMount() {
        var _this = this;
        $.ajax({url: "/categories", dataType: "json", success: function(result){
            _this.setState({categories: result});
        }});
        $.ajax({url: "/stages", dataType: "json", success: function(result){
            _this.setState({stages: result});
        }});
    }

    render(){
        return (
            <IdeaForm
                categories= {this.state.categories}
                onIdeaSubmit = {this.submit.bind(this)}
                stages = {this.state.stages}
                editMode = {true}
                ideaId = {this.props.params.ideaId}
            />
        );
    }
}

export default EditIdeaContainer;