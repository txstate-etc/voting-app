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
                    browserHistory.push('/admin/stages');
                }})
        }
        else{
            $.ajax({url: "/stages/", 
                dataType: "json",
                data: data,
                method: 'POST',
                success: function(result){
                    browserHistory.push('/admin/stages');
                }})
        }
        
    }

    render(){
        var invalidName = this.state.stageErr.length > 0;
        return(
            <div className="container">
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
                    <button type="submit" className="btn btn-warning pull-right">Save Changes</button>
                </form>
            </div>
        )
    }
}

export default StageForm;