import React, { useState } from 'react';
import Nav from './Nav.js';
import { Link } from 'react-router-dom';
import styles from '../css/Header.module.css'

function Header() {
  return (
    <header id="app-header" className={styles.header}>
        <Link to={"/"}>
          <h1 id="toMain" className={styles.logo}>Welcome to My App</h1>
        </Link>
        <Nav />
    </header>
  );
}

export default Header;