import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostListPage from './Post/PostListPage.js';
import PostPage from './Post/PostPage.js';
import PostForm from '../Form.js';
import HistoryPage from './History/HistoryPage.js';
import OptionPage from './Option/OptionPage.js';

function Main() {
    return (
        <main id="app-Main">
            <Routes>
                <Route path="/" element={<PostListPage />} />
                <Route path="/postList" element={<PostListPage />} />
                <Route path="/post/:id" element={<PostPage />} />
                <Route path="/post/write" element={<PostForm mode={'create'} />} />
                <Route path="/post/update/:id" element={<PostForm mode={'update'} />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/options" element={<OptionPage />} />
            </Routes>
        </main>
      
    );
}
  
  export default Main;
  