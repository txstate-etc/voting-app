import React from 'react';

class LoginRedirect extends React.Component{

    componentDidMount(){
        location.replace("/login");
    }

    render(){
        return null;
    }
}

export default LoginRedirect;