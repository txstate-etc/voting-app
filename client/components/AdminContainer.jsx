import React from 'react';
import Admin from './Admin.jsx';
import $ from 'jquery';

class AdminContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <Admin
                children = {this.props.children}
            />
        );
    }
}

export default AdminContainer;