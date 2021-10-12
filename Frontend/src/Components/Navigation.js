import React, { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { IconContext } from 'react-icons';
import { PMSidebarData } from './PMSidebarData';
import { SASidebarData } from './SASideBarData';
import { observer } from 'mobx-react';

const Navbar = props => {
  const [sidebar, setSidebar] = useState(true);
  const [role, setRole] = useState('');

  return (
    <>
      <IconContext.Provider value={{ color: 'white' }}>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className="nav-menu-items">
            {props.projectStore.sidebarArray.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <NavLink exact to={item.path} activeClassName="main-nav-active">
                    {item.icon}
                    <span>{item.title}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
};

export default observer(Navbar);
