import React from 'react';
import SearchBar from './SearchBar.jsx';
import AddNew from './AddNew.jsx';
import SelectCategoryContainer from './SelectCategoryContainer.jsx';
class Admin extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className="container">
                <div className="row top-buffer">
                  <div className="col-md-6">
                    <SearchBar/>
                  </div>
                  <div className="col-md-6">
                    <div className="pull-right"><AddNew /></div>
                  </div>
                </div>
                <br/>
                <div className="row">
                  <div className="col-md-3">
                    <select>
                      <option>Comments</option>
                      <option>Ideas</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <SelectCategoryContainer
                      updateCategory = {this.props.updateCategory}
                    /> Select Category
                  </div>
                </div>
                <hr/>
                <div className="row">
                  <div className="col-md-6 item-list">

                    <div className="media">
                      <div className="media-left ">
                        <span className="new-indicator">NEW</span>
                      </div>
                      <div className="media-body">
                        <h4 className="media-heading"><a href="#">Feature #1</a>  <span className="create-date">August 5, 2:00PM</span></h4>
                        <p>Here is another idea.</p>
                        <span>
                          Submitted by a_f269
                        </span>
                      </div>
                    </div>

                    <div className="media selected">
                      <div className="media-left ">
                        <span className="new-indicator">NEW</span>
                      </div>
                      <div className="media-body">
                        <h4 className="media-heading"><a href="#">Feature #2</a>  <span className="create-date">August 15, 4:30PM</span></h4>
                        <p>Where do these feature numbers come from?  Are they the IDs in the database?  Or
                          do they come from somewhere else?
                        </p>
                        <span>
                          Submitted by a_f269
                        </span>
                      </div>
                    </div>

                    <div className="media">
                      <div className="media-left ">
                        <span className="new-indicator">NEW</span>
                      </div>
                      <div className="media-body">
                        <h4 className="media-heading"><a href="#">Feature #3</a>  <span className="create-date">August 10, 5:00PM</span></h4>
                        <p>This idea does not have much description.</p>
                        <span>
                          Submitted by jd3422
                        </span>
                      </div>
                    </div>

                    <div className="media">
                      <div className="media-left ">
                        <span className="new-indicator invisible">NEW</span>
                      </div>
                      <div className="media-body">
                        <h4 className="media-heading"><a href="#">Feature #4</a>  <span className="create-date">August 1, 3:00PM</span></h4>
                        <p>This idea has already been moderated.</p>
                        <span>
                          Submitted by jd3422
                        </span>
                      </div>
                    </div>


                  </div>
                  <div className="col-md-6">
                    <div className="media">
                      <div className="media-left">
                        <span className="new-indicator">NEW</span>
                      </div>
                      <div className="media-body">
                        <h3 className="media-heading">Feature #2<span className="idea-detail-category">(Gato)</span></h3> 
                        <span className="idea-detail-creator">
                          a_f269 
                        </span>
                        <span className="idea-detail-age">3 hours ago</span>
                        <p className="idea-detail-description">Where do these feature numbers come from?  Are they the IDs in the database?  Or
                          do they come from somewhere else?
                        </p>
                        <a className="btn btn-warning edit-idea" href="">
                          <i className="fa fa-pencil"></i>
                          Edit
                        </a>
                        <div className="contact-user">
                          <p>Contact User</p>
                          <textarea rows="5" className="form-control" placeholder="Send user an email"></textarea>
                          <button className="btn btn-warning pull-right">Send</button>
                        </div>
                      </div>
                    </div>
                    <a className="btn btn-warning approve-idea pull-right" href="">
                      <i className="fa fa-check"></i>
                      Approve
                    </a>
                  </div>
                </div>
                
            </div>
        );
    }
}

export default Admin;