import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';

class StageForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "", 
            stageErr: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        var _this = this;
        if(this.props.route.editMode){
            var id = this.props.params.stageId;
            $.ajax({url: "/stages/" + id, dataType: "json", success: function(result){
                _this.setState({name: result.name});
            }});
        }

    }

    handleNameChange(e){
        this.setState({name: e.target.value});
        if(e.target.value.length > 0)
            this.setState({stageErr: ""})
    }

    handleSubmit(e){
        var _this = this;
        e.preventDefault();
        var name = this.state.name;
        if(!name){
            this.setState({stageErr: "Please enter a stage name"});
            return;
        }
        var editMode = this.props.route.editMode;
        var data={
            name: name
        }
        if(editMode){
            var id = this.props.params.stageId;
            $.ajax({url: "/stages/" + id, 
                dataType: "json",
                data: data,
                method: 'PUT',
                success: function(result){
                   _this.props.editStage(result);
                    browserHistory.push('/admin/stages');
                },
                error: function(xhr, status, err){
                    //unauthorized
                    if(xhr.status == 403){
                        //redirect to ???
                        browserHistory.push('/notauthorized');
                    }
                }
            })    
        }
        else{
            $.ajax({url: "/stages/", 
                dataType: "json",
                data: data,
                method: 'POST',
                success: function(result){
                    _this.props.addStage(result);
                    browserHistory.push('/admin/stages');
                },
                error: function(xhr, status, err){
                    //unauthorized
                    if(xhr.status == 403){
                        //redirect to ???
                        browserHistory.push('/notauthorized');
                    }
                }
            })
        }
        
    }

    handleCancel(){
        e.preventDefault();
        browserHistory.goBack();
    }

    render(){
        var invalidName = this.state.stageErr.length > 0;
        return(
            <div className="container">
                <h3>{this.props.route.editMode ? "Edit Stage" : "Add Stage"}</h3>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="stage">Name:</label>
                        <span className="errorMsg" role={invalidName ? "alert" : ""}>{this.state.stageErr}</span>
                        <input className="form-control" 
                                id="stage" 
                                type="text" 
                                value={this.state.name} 
                                onChange={this.handleNameChange.bind(this)}
                                ref={function(input) {
                                  if (input != null && invalidName) {
                                    input.focus();
                                  }
                                }}/>
                    </div>
                    <div className="admin-form-buttons pull-right">
                        <button type="submit" className="btn btn-warning save">Save Changes</button>
                        <button className="btn btn-warning" onClick={this.handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default StageForm;