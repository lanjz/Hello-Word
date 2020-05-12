import React from 'react';
import HookApp from './pages/hook/HookApp'

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

const routerConfig = [
    {
        path: '/',
        component: App,
        name: 'App',
        indexRoute: { component: Inbox },
        childRouter: [
            { path: 'about', component: About, name: 'About' },
            { path: 'inbox',
                component: Inbox,
                name: 'Inbox'
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
    /*{
        path: '/hook',
        component: HookApp,
        name: 'Hook'
    }*/
]
export default routerConfig