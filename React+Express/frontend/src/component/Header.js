import React, { useState } from 'react';
import Nav from './Nav.js';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header id="app-header">
        <Link to={"/"}>
          <h1 id="toMain">Welcome to My App</h1>
        </Link>
        <Nav />
    </header>
  );
}

export default Header;