import { BrowserRouter as Router, Routes, Route, Link  } from "react-router-dom";
import React, { useState } from 'react';

const Nav = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/postList">Posts</Link></li>
                <li><Link to="/write">Write</Link></li>
                <li><Link to="/history">History</Link></li>
                <li><Link to="/options">Options</Link></li>
            </ul>
        </nav>
    )
}

export default Nav;