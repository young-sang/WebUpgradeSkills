import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from './component/Footer.js';
import Header from './component/Header.js';
import PostListPage from './component/PostListPage.js';
import PostPage from './component/PostPage.js';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<PostListPage />} />
        <Route path="/postList" element={<PostListPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        {/* <Route path="/write" element={<WritePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/options" element={<OptionPage />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
