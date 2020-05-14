import React from 'react';
import HookApp from './pages/hook/HookApp'
import Login from './pages/Inbox'
import Context from './pages/class/Context'
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
        component: Context,
        name: 'ClassApp',
        // exact: true,
        childRouter:
            [
                { path: '/context', component: Context, name: 'Context'},
                { path: '/about', component: About, name: 'About' },
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
    }
]
const hookRouter = [
    {
        path: '/hook',
        component: Login,
        name: 'App',
        // indexRoute: { component: Inbox },
        childRouter: [
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