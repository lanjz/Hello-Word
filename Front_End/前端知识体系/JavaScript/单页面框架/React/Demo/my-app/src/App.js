import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom';
import {renderRoutes} from 'react-router-config'
import routeConfig from './router'
import Nav from './components/Nav'
function App() {
    return (
        <>
            <Nav></Nav>
            <BrowserRouter>
                {renderRoutes(routeConfig)}
            </BrowserRouter>
        </>
    )
}

export default App