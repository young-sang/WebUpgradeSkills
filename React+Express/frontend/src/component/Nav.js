import { BrowserRouter as Router, Routes, Route, Link  } from "react-router-dom";
import React, { useState } from 'react';

const Nav = () => {
    return (
        <nav>
            <ul className="items">
                <li className="item"><Link to="/postList">Posts</Link></li>
                <li className="item"><Link to="/post/write">Write</Link></li>
                <li className="item"><Link to="/history">History</Link></li>
                <li className="item"><Link to="/options">Options</Link></li>
            </ul>
        </nav>
    )
}

export default Nav;