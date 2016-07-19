import React from 'react';

class SearchBar extends React.Component{

    render(){
        return(
            <div className="search-bar">
              <span className="icon fa fa-search"></span>
              <input type="search" className="input-lg" placeholder="Search ideas"/>
          </div>
        );
    }
}

export default SearchBar;