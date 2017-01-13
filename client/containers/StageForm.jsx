import React from 'react'
import {connect} from 'react-redux'
import { browserHistory } from 'react-router'
import {fetchStages, addStage, updateStage} from '../actions/stage-actions'

class StageForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "", 
            stageErr: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    loadData(){
        this.props.fetchStages()
    }

    componentWillMount(){
        this.loadData()
    }

    componentDidMount(){
        this.updateStageState(this.props)
    }

    updateStageState(props){
        if(props.stages.length > 0 && props.route.editMode){
            var stage = props.stages.filter(s =>{
                return s.id == props.params.stage_id;
            })
            if(stage[0])
                this.setState({name: stage[0].name})
            else{
               //they can't edit a stage that doesn't exist!
                browserHistory.push('/notfound')
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.updateStageState(nextProps)
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
        if(editMode){
            var id = this.props.params.stage_id;
            this.props.updateStage(id, {name: name})
        }
        else{
            this.props.addStage(name)
        }
        browserHistory.push('/admin/stages')
    }

    handleCancel(e){
        e.preventDefault();
        browserHistory.push('/admin/stages')
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


const mapStateToProps = (state, ownProps) => {
    return {
        stages: state.stageState.stages
    }
}

export default connect(mapStateToProps, {
  fetchStages,
  addStage,
  updateStage
})(StageForm)