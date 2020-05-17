import React from 'react';
import HookApp from './pages/hook/HookApp'
import Login from './pages/Inbox'
import ClassIndex from './pages/class/index'
import Context from './pages/class/Context'
import Refs from './pages/class/Refs'
function Dashboard() {
    return <h1>Hello, Dashboard</h1>;
}
function About() {
    return <h1>Hello, About</h1>;
}
function Inbox() {
    return <h1>Hello, Inbox</h1>;
}
function App() {
    return <h1>App</h1>;
}
function ClassApp() {
    return <h1>ClassApp</h1>;
}
function Message() {
    return <h1>Message</h1>;
}
const classRouter = [
    {
        path: '/class',
        component: ClassIndex,
        indexRoute: { component: ClassIndex },
        name: 'ClassApp',
        exact: true,
    },
    { path: 'context', component: Context, name: 'Context'},
    { path: 'about', component: About, name: 'about' },
    { path: '/class/refs', component: Refs, name: 'Refs' },
    {
        path: 'inbox',
        component: Inbox,
        name: 'Inbox',
        childRoutes: [
            { path: '/messages/:id', component: Message },
            {
                path: 'messages/:id',
                onEnter: function (nextState, replaceState) {
                    replaceState(null, '/messages/' + nextState.params.id)
                }
            }
        ]
    }
]
const hookRouter = [
    {
        path: '/hook',
        component: Login,
        name: 'App',
        indexRoute: { component: Inbox },
        childRoutes: [
            { path: '/about', component: About, name: 'About' },
            { path: 'inbox',
                component: Inbox,
                name: 'Inbox',
              /*  childRoutes: [
                    { path: '/messages/:id', component: Message },
                    { path: 'messages/:id',
                        onEnter: function (nextState, replaceState) {
                            replaceState(null, '/messages/' + nextState.params.id)
                        }
                    }
                ]*/
            }

        ]
    },
]
export default [...classRouter, ...hookRouter]