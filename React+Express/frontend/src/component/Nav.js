import React, { useState } from 'react';

const Nav = () => {
    return (
        <nav>
            <ul>
            <li><Link to="/Post">Posts</Link></li>
            <li><Link to="/Write">Write</Link></li>
            <li><Link to="/History">History</Link></li>
            <li><Link to="/Options">Options</Link></li>
            </ul>
        </nav>
    )
}

export default Nav;