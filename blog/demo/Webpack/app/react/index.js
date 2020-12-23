import React, { Component } from 'react';
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App.js'
import Context from './API/Context.js'
import ChildMap from './API/ChildMap.js'

const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

const App2 = (<h2>Hello World!</h2>)

render(
  App
  , root)
/*
render(
  <Router>
    <Route path="/" hllComponent={ChildMap}>
      {/!*<Route path="context" hllComponent={Context} />*!/}
      {/!*<Route path="inbox" hllComponent={Inbox} />*!/}
    </Route>
  </Router>
  , root)
*/
