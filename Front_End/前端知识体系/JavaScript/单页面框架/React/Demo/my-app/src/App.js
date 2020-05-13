import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import routeConfig from './router'
import Nav from './components/Nav'
import Home from './pages/About'
import Login from './pages/Inbox'
import Detail from './pages/About'
function App() {
    return (
        <>
            <Nav></Nav>
            <BrowserRouter>
                {/*<Switch>*/}
                    <Route path='/' exact component={Home}></Route>
                    {/*<Redirect to="/" from='/' />*/}
                <Route path='/about' component={Login}></Route>
                <Route path='/about/:id' component={Home}></Route>
                {/*<Route path='/about/' exact component={Home}></Route>*/}
                {/*</Switch>*/}

            </BrowserRouter>
            {/*<Router routes={routeConfig} />*/}
        </>
    )
}

export default App