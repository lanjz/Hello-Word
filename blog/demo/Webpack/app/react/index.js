import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router'
import routes from './router'

const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)
React.render(<Router routes={routes} />, document.body)