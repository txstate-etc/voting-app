import React from 'react';
import Main from './Main.jsx';
import $ from 'jquery';

class MainContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ideaList:[],
            category: "" 
        };
    }

    componentDidMount() {
        var _this = this;
        $.ajax({url: "/ideas?comments=true", dataType: "json", success: function(result){
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

    render(){
        return (
            <Main
                updateCategory = {this.updateCategory.bind(this)}
                ideaList = {this.state.ideaList}
                numIdeas = {this.state.ideaList.length}
                auth = {this.props.auth}
            />
        );
    }
}

export default MainContainer;