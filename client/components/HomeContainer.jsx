import React from 'react';
import Home from './Home.jsx';
import $ from 'jquery';

const ideasPerPage = 10;

class HomeContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ideaList:[],
            ideaCount: 0,
            category: "",
            currentPage: 1
        };
    }

    componentDidMount() {
        var _this = this;
        var offset = (this.state.currentPage <= 1) ? 0 : (10 * (this.state.currentPage -1));
        var url = "/ideas?comments=true&stageRequired=true&offset=" + offset + "&limit=" + ideasPerPage;
        $.ajax({url: url, dataType: "json", success: function(result, textStatus, jqXHR){
            var totalResults = parseInt(jqXHR.getResponseHeader('X-total-count'));
            _this.setState({ideaList: result});
            _this.setState({ideaCount: totalResults});
        }});
    }

    search(terms){
        console.log("You searched for " + terms);
        var _this = this;
        var url="/ideas?comments=true&stageRequired=true&q=" + terms;
        $.ajax({url: url, dataType: "json", success: function(result){
            _this.setState({ideaList: result});
        }});
    }

    updateCategory(newCat){
        this.setState({category: newCat});
        var _this = this;
        var url = (newCat === "0" || newCat.length < 1) ? "/ideas" : "/ideas?category=" + newCat;
        $.ajax({url: url, dataType: "json", success: function(result){
            _this.setState({ideaList: result});
        }});
    }

    updatePage(newPage){
        var _this = this;
        this.setState({currentPage: newPage});
        var offset = (newPage <= 1) ? 0 : (10 * (newPage -1));
        var url = "/ideas?comments=true&stageRequired=false&offset=" + offset + "&limit=" + ideasPerPage;
        $.ajax({url: url, dataType: "json", success: function(result, textStatus, jqXHR){
            var totalResults = parseInt(jqXHR.getResponseHeader('X-total-count'));
            _this.setState({ideaList: result});
        }});
    }

    render(){
        return (
            <Home
                updateCategory = {this.updateCategory.bind(this)}
                ideaList = {this.state.ideaList}
                ideaCount = {this.state.ideaCount}
                numIdeas = {this.state.ideaList.length}
                search = {this.search.bind(this)}
                ideasPerPage = {ideasPerPage}
                updatePage = {this.updatePage.bind(this)}
                currentPage = {this.state.currentPage}
            />
        );
    }
}

export default HomeContainer;