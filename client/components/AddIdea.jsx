import React from 'react';
import SelectCategoryContainer from './SelectCategoryContainer.jsx';

class AddIdea extends React.Component {

    render(){
        return (
            <div className="container">
                <form>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" className="form-control" placeholder="Title for Feature Request"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <SelectCategoryContainer
                            updateCategory = {function(){/* do nothing here */}}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="attachFile">Add Attachments</label>
                        <input type="file" id="attachFile"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="text">Description</label>
                        <textarea id="text" rows="15" className="form-control" placeholder="Describe feature...">
                        </textarea>
                    </div>
                    <button type="submit" className="btn btn-warning pull-right">Submit Feature</button>
                </form>
            </div>
        );
    }
}

export default AddIdea;