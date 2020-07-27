import React, { Component } from 'react';
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App.js'
import Context from './API/Context.js'

const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)


render(
  <Router>
    <Route path="/" component={Context}>
      {/*<Route path="context" component={Context} />*/}
      {/*<Route path="inbox" component={Inbox} />*/}
    </Route>
  </Router>
  , root)