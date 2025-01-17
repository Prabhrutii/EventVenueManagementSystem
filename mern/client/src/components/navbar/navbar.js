import { Link, useMatch, useResolvedPath } from "react-router-dom"
import React, { Component }  from 'react';

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        EventHUB
      </Link>
      <ul>
        <CustomLink to="/sports">Sports</CustomLink>
        <CustomLink to="/events">Events</CustomLink>
        <CustomLink to="/about">About</CustomLink>
        <CustomLink to="/UserProfile">Profile</CustomLink>
        <CustomLink to="/signin">Sign In</CustomLink>
        <CustomLink to="/signup">Sign Up</CustomLink>

      </ul>
    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}