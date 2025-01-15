import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostListPage from './PostListPage.js';
import PostPage from './PostPage.js';

function Main() {
    return (
        <main id="app-Main">
            <Routes>
                <Route path="/" element={<PostListPage />} />
                <Route path="/postList" element={<PostListPage />} />
                <Route path="/post/:id" element={<PostPage />} />
                {/* <Route path="/write" element={<WritePage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/options" element={<OptionPage />} /> */}
            </Routes>
        </main>
      
    );
  }
  
  export default Main;
  