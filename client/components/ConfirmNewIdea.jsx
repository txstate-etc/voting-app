import React from 'react';
import { Link } from 'react-router';

class ConfirmNewIdea extends React.Component {
    
    render(){
        return(
            <div className="container">
                <p>Thank you for your submission.  Your idea will appear once it has 
                been evaluated and approved.</p>
                <Link to="/">Return to Voting Home</Link>
            </div>
        );
    };
}

export default ConfirmNewIdea;