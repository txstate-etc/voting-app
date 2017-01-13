import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import routes from '../routes'
import {getRoutes} from '../routes'
import { Router } from 'react-router'
import DevTools from './DevTools'

const Root = ({ store, history }) => (
    <Provider store={store}>
        <div>
          <Router history={history} >
            {getRoutes(store)}
          </Router>
         { process.env.NODE_ENV === 'production' ? "" : <DevTools />}
        </div>
    </Provider>
)

export default Root

// { process.env.NODE_ENV === 'production' ? "" : <DevTools />}