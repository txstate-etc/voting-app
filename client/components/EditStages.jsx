import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';

class EditStages extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stages: [],
            stagesToDelete: [] 
        };
    }

    componentDidMount(){
        var _this = this;
        $.ajax({url: "/stages", dataType: "json", success: function(result){
            _this.setState({stages: result});
        }});
    }

    deleteStage(id, e){
        var deleteList = this.state.stagesToDelete.slice(0);
        if(e.target.checked){
            deleteList.push(id);
            this.setState({stagesToDelete: deleteList});
        }
        else{
            this.removeFromDeleteList(id);
        }
    }

    removeFromDeleteList(id){
        var deleteList = this.state.stagesToDelete.slice(0);
        var index = deleteList.indexOf(id);
        if(index > -1){
            deleteList.splice(index, 1);
        }
        this.setState({stagesToDelete: deleteList});
    }

    handleDeletions(){
        var _this = this;
        var count = this.state.stagesToDelete.length;
        var confirmationMessage = "Delete " + count + " stage" + ((count == 1) ? "?" : "s?");
        if(confirm(confirmationMessage)){
            var deletions = this.state.stagesToDelete.map(function (id) { 
                return $.ajax({
                    url: "/stages/" + id,
                    method: 'DELETE',
                    dataType: "json",
                    success: function(result){
                        //remove stage from display list
                        var stages = _this.state.stages.filter(function(stage){
                            return stage.id != id;
                        })
                        _this.setState({stages: stages});
                        //clear from list of items to be deleted
                        _this.removeFromDeleteList(id);
                    }
                }); 
            });

        }
    }

    render(){
        return(
            <div>
            {this.props.children ||
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
                                this.state.stages.map(stage => {
                                    return (
                                        <tr key={stage.id}>
                                            <td><Link to={"/admin/stages/" + stage.id}>{stage.name}</Link></td>
                                            <td><input type="checkbox" value={stage.id} onClick={this.deleteStage.bind(this,stage.id)}/></td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td colSpan="2"><a className="btn btn-warning btn-sm" href="/admin/stages/add">Add Stage</a></td>
                            </tr>
                        </tbody>
                    </table>
                    { this.state.stagesToDelete.length > 0 && <button className="btn btn-warning btn-sm pull-right" onClick={this.handleDeletions.bind(this)}>Delete Selected Stages</button>}
                </div>
            }
            </div>
            )
    }
}

export default EditStages;