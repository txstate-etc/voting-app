import React from 'react';

class AddComment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTextChange(e) {
        this.setState({text: e.target.value});
    }

    handleSubmit(e){
        e.preventDefault();
        var text=this.state.text;
        if(!text){
            return;
        }
        this.props.onCommentSubmit({text: text});
        this.setState({text: ''});
    }
    
    render(){
        return(
            <form action="" onSubmit={this.handleSubmit}>
                <textarea rows="5" className="form-control" placeholder="Tell us what you think" value={this.state.text} onChange={this.handleTextChange.bind(this)}></textarea>
                <button className="btn btn-warning pull-right">Save Comment</button>
            </form>
        );
    }
}

export default AddComment;