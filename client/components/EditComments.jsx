import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import {sumUnapprovedCommentsAndReplies} from '../util';

class EditComments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ideas: [],
            commentsToDelete: [] 
        };
    }

    componentDidMount(){
        var _this = this;
        $.ajax({url: "/ideas?comments=true", dataType: "json", success: function(result){
            _this.setState({ideas: result});
        }});
    }

    render(){
        return(
            <div>
                <div>
                    <h3>Comments</h3>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Idea</th>
                                <th>Unapproved Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.ideas.map(idea => {
                                    return (
                                        <tr key={idea.id}>
                                            <td><Link to={"/view/" + idea.id}>{idea.title}</Link></td>
                                            <td>{sumUnapprovedCommentsAndReplies(idea.comments)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

}

export default EditComments;