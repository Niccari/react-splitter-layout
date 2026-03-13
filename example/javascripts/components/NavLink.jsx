import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavLinkComponent(props) {
  return (
    <NavLink {...props} className={({ isActive }) => (isActive ? 'active' : '')} />
  );
}
