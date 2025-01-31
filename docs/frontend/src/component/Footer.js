import React, { useState } from 'react';
import styles from '../css/Footer.module.css';

function Footer() {
  return (
    <footer id="app-footer" className={styles.footer}>
        <h2>Posts</h2>
        <ul>
            <li>Post 1</li>
            <li>Post 2</li>
            <li>Post 3</li>
        </ul>
    </footer>
  );
}

export default Footer;