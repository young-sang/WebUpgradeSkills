import React, { useState } from 'react';

const Nav = () => {
    const [currentPage, setCurrentPage] = useState("Posts");

    const renderContent = () => {
        switch(currentPage) {
            case "Posts":
                return renderPostsPage();
            case "Write":
                return renderPostForm();
            case "History":
                return renderHistoryPage();
            case "Options":
                return renderOptionPage();
            default:
                return <div>Page not found</div>;
        }
    };

    const navItems = ["Posts", "Write", "History", "Options"];

    return (
        <div>
            <nav>
                <ul className='items'>
                    {navItems.map((item) => (
                        <li
                        key={item}
                        className='item'
                        onClick={() => setCurrentPage(item)}
                        >{item}
                        </li>
                    ))}
                </ul>
            </nav>
            <div id='app-content'>{renderContent()}</div>
        </div>
    )
}