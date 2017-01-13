import React from 'react';

class LoginRedirect extends React.Component{

    componentDidMount(){
        console.log("login redirect")
        if(this.props.location.state){
            location.replace("/login?url=" + encodeURIComponent(this.props.location.state.nextPathname));
        }
        else{
            location.replace("/login");
        }
    }

    render(){
        return null;
    }
}

export default LoginRedirect;