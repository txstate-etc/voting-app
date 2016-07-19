import "babel-register";
import React from 'react';

class AddNew extends React.Component{
     render(){
        return(
            <a className="btn btn-warning" href="/new">
                <i className="fa fa-plus"></i>
                &nbsp;
                ADD a New Idea
            </a>
        );
    }
}

export default AddNew;