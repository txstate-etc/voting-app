import React from 'react';
import Layout from './Layout.jsx';
import {isLoggedIn, isAdmin, isCommentMod, isIdeaMod, getNetId, getUserId} from '../auth';

class AuthContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
             auth: {
                loggedIn: false,
                admin: false,
                commentMod: false,
                ideaMod: false,
                netId: "",
                userId: ""
             }
        };
    }

    componentDidMount(){
        if(isLoggedIn()){
            this.setState({
                auth: {
                    loggedIn: true,
                    admin: isAdmin() || false,
                    commentMod: isCommentMod(),
                    ideaMod: isIdeaMod(),
                    netId: getNetId(),
                    userId: getUserId()
                }
            });
         }
    }

    render(){
        //pass auth to all children
        var _this = this;
        var children = React.Children.map(this.props.children, function(child){
            return React.cloneElement(child, {
                auth: _this.state.auth
            })
        });
        return(
            <div>
                {children}
            </div>
        );
    }
}

export default AuthContainer;