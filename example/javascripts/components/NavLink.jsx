/* eslint import/no-extraneous-dependencies: [0] */
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavLinkComponent(props) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <NavLink {...props} className={({ isActive }) => (isActive ? 'active' : '')} />
  );
}
