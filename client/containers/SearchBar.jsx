import React from 'react';

class SearchBar extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            query: ""
        };
    }

    handleSearchField(e){
        this.setState({query: e.target.value});
    }

    handleSubmit(e){
        var _this = this;
        e.preventDefault();
        var terms = this.state.query;
        this.props.search(terms);
    }

    render(){
        return(
            <form action="" onSubmit={this.handleSubmit.bind(this)}>
                <div className="search-bar">
                  <input type="search" className="input-lg" id="search" placeholder="Search ideas" onChange={this.handleSearchField.bind(this)} value={this.state.searchTerms}/>
                  <button type="submit" className="icon fa fa-search"></button>
                </div>
            </form>
        );
    }
}

export default SearchBar;