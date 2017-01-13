import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import Login from '../components/Login.jsx'
import DrawerMenu from '../components/DrawerMenu.jsx'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        menuVisible: false
    };
  }

  showMenu(){
      this.setState({'menuVisible': true})
  }

  hideMenu(){
      this.setState({'menuVisible': false})
  }

  inMobileDrawer(element){
    while(!element.classList.contains("mobile-drawer")){
      element = element.parentNode
      if (!element || !element.classList) return false
    }
    return true;
  }

  handleClick(e){
      var isHamburger = e.target.classList.contains("hamburger");
      if (this.state.menuVisible && !isHamburger && !this.inMobileDrawer(e.target)) {
        e.preventDefault();
        this.hideMenu();
      }
  }
  
  render() {
    return (
      <div className="app" onClick={this.handleClick.bind(this)}>
          <header>
          <Login
              auth = {this.props.auth}
              currentPage = {this.props.location.pathname}
          />
          </header>
          <DrawerMenu
              visible = {this.state.menuVisible}
              currentPage = {this.props.location.pathname}
              isAdmin = {this.props.isAdmin}
              isLoggedIn = {this.props.isLoggedIn}
          />
          <div className="title-bar">
              <i className="logo fa fa-check-square-o"></i>
              <a href="/" className="app-title">Voting Application</a>
              <a onClick={this.showMenu.bind(this)}><i className="fa fa-bars hamburger pull-right"></i></a>
          </div>
          {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.authState.isLoggedIn,
    isAdmin: state.authState.isAdmin
  }
}

export default connect(mapStateToProps, {
  
})(App)

//export default App
