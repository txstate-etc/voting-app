import React from 'react';
import { Link } from 'react-router';

class NotAuthorized extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>Not Authorized</h1>
        <p>You do not have permission to view this page.  If you believe this is a mistake, please contact a system administrator.</p>
        <p>
          <Link to="/">Go back to the main page</Link>
        </p>
      </div>
    );
  }
}

export default NotAuthorized;