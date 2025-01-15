import React, { useState } from 'react';
import Nav from './Nav.js';

function Header() {
  return (
    <div>
        <h1 id="toMain">Welcome to My App</h1>
        <Nav />
    </div>
  );
}

export default Header;