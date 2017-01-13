import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import cookie from 'react-cookie';
import Root from './containers/Root'
import configureStore from './store/configureStore'
import {receiveLogin} from './actions/auth-actions'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

const authCookie = cookie.load('user');

if(authCookie){
    store.dispatch(receiveLogin(authCookie));
}

render(
  <Root store={store} history={history}/>,
  document.getElementById('content')
)
