import ClassIndex from './pages/class/Index'
import Inbox from './pages/class/Inbox'
import About from './pages/class/About'
const routes = {
  path: '/',
  component: ClassIndex,
  childRoutes: [
    { path: 'about', component: About },
    { path: 'inbox', component: Inbox },
  ]
}

export default routes