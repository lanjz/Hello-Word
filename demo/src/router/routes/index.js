/* eslint-disable no-unused-vars */
import routes, { LAYOUT_ROUTER_MAIN } from './const-routes';
import sysManageRoutes from './sys-manage';

export const asyncRoutes = [...sysManageRoutes];

export const constRoutes = [...routes];

const homeRouter = routes.find((item) => item.name === 'LAYOUT_ROUTER_MAIN') || {};

export const buildInHomeMenu = homeRouter.children || [];

export default [...routes, ...asyncRoutes];
