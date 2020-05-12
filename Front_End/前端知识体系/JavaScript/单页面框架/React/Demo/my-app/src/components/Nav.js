import React from 'react';
import { Link } from 'react-router-dom';
import RouterConfig from '../router'

function NavItem({item}) {
    return (
        <div className="nav-item">
            {/*<Link to={item.path}>{item.name}</Link>*/}{item.name}
            {item.childRouter && item.childRouter.length && (
                <span >
                    {item.childRouter.map(i =><NavItem item={i} key={i.name}/>)}
                </span>
            )}
        </div>
    )
}
export default function Nav() {
    return (
        <div className="nav">
            {
                RouterConfig.map(item => <NavItem item={item} key={item.name}/>)
            }
        </div>
    )
}