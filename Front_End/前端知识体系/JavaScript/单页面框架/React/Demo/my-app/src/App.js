import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import routeConfig from './router'
import Nav from './components/Nav'

function App() {
    return (
        <>
            <Nav></Nav>
            <Router routes={routeConfig} />
        </>
    )
}

export default App