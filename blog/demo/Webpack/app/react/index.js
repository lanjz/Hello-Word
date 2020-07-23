import React, { Component } from 'react';
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import routes from './router'
import App from './App.js'

const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

const routes = [
  {
    path: '/',
    indexRoute: { component: App },
    component: App,
    childRoutes: [
      { path: 'about', component: App },
      { path: 'inbox', component: App },
    ]
  }
]


render(<Router routes={routes} />, root)