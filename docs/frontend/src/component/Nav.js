import { BrowserRouter as Router, Routes, Route, Link  } from "react-router-dom";
import React, { useState } from 'react';
import styles from '../css/Nav.module.css';

const Nav = () => {
    return (
        <nav className={styles.nav}>
            <ul className={styles.items}>
                <li className={styles.item}><Link to="/postList">Posts</Link></li>
                <li className={styles.item}><Link to="/post/write">Write</Link></li>
                <li className={styles.item}><Link to="/history">History</Link></li>
                <li className={styles.item}><Link to="/options">Options</Link></li>
                <li className={styles.item}><Link to="/login">Login</Link></li>
            </ul>
        </nav>
    )
}

export default Nav;