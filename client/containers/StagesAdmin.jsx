import React from 'react'
import { connect } from 'react-redux'
import {fetchStages, deleteStage} from '../actions/stage-actions'
import { Link } from 'react-router'
import Modal from 'react-modal'
import SelectStage from '../components/SelectStage.jsx'
import {isEmpty} from '../util'

class StagesAdmin extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            stageToDelete: {},
            newStageAssignment: 0,
            newStageError: false
        };
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    loadData(){
        this.props.fetchStages();
    }

    componentWillMount(){
        this.loadData();
    }

    deleteStage(id, name){
        this.setState({stageToDelete: {id, name}})
        this.openModal()
    }

    assignNewStage(id){
        this.setState({newStageError: false})
        this.setState({newStageAssignment: id})
    }

    reassignStage(e){
        e.preventDefault();
        var _this = this;
        if(this.state.newStageAssignment == 0){
            this.setState({newStageError: true})
            return;
        }
        this.props.deleteStage(parseInt(this.state.stageToDelete.id) , parseInt(this.state.newStageAssignment))
        .then(function(){
            if(_this.props.errorMessage.length == 0)
                _this.setState({modalIsOpen: false})
        })
    }

    render(){
        //create list of alternative stage options if the user wants to delete a stage
        if(!isEmpty(this.state.stageToDelete)){
            var _this = this;
            var alternateStages = this.props.stages.filter(function(stage){
                return stage.id != _this.state.stageToDelete.id
            })
        }
        return(
            <div>
                <h3>Stages</h3>
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.stages.map(stage => {
                                return (
                                    <tr key={stage.id}>
                                        <td><Link to={"/admin/stages/" + stage.id}>{stage.name}</Link></td>
                                        <td><a className="delete-item" onClick={this.deleteStage.bind(this, stage.id, stage.name)}><i className="fa fa-trash" aria-label={"Delete " + stage.name + " stage."}></i></a></td>
                                    </tr>
                                )
                            })
                        }
                        <tr>
                            <td colSpan="2"><a className="btn btn-warning btn-sm" href="/admin/stages/new">Add Stage</a></td>
                        </tr>
                    </tbody>
                </table>
                {
                    !isEmpty(this.state.stageToDelete) &&
                    <Modal
                      className="item-reassignment-modal"
                      overlayClassName="item-reassignment-overlay"
                      isOpen={this.state.modalIsOpen}
                      onRequestClose={this.closeModal.bind(this)}
                      contentLabel="Update Stage">
                        <div>
                            <h2>Move Ideas to New Stage</h2>
                            <p>You are deleting the <b>{this.state.stageToDelete.name}</b> stage.  Please select a new 
                            stage for the ideas in this stage.
                            </p>
                            <form onSubmit={this.reassignStage.bind(this)}>
                                {this.state.newStageError && <p className="errorMsg">Please select a stage.</p>}
                                <p className="errorMsg">{this.props.errorMessage}</p>
                                <label htmlFor="stage">Stage:</label>
                                <SelectStage
                                    options={alternateStages}
                                    addAllOption={false}
                                    updateStage = {this.assignNewStage.bind(this)}/>
                                <div className="modalButtons">
                                    <button type="submit" onClick={this.reassignStage.bind(this)} className="btn btn-warning">Reassign Stage</button>
                                    <button onClick={this.closeModal.bind(this)} className="btn btn-warning">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                }
            </div>
        )
    }

}

const mapStateToProps = (state, ownProps) => {
  return {
    stages: state.stageState.stages,
    errorMessage: state.stageState.errorMessage
  }
}

export default connect(mapStateToProps, {
  fetchStages,
  deleteStage,
})(StagesAdmin)
