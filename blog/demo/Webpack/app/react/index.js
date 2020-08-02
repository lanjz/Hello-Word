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
    <Route path="/" component={ChildMap}>
      {/!*<Route path="context" component={Context} />*!/}
      {/!*<Route path="inbox" component={Inbox} />*!/}
    </Route>
  </Router>
  , root)
*/
