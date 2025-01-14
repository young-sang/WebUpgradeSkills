import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from './component/Footer.js';
import Header from './component/Header.js';

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<PostPage />} />
          <Route path="/Post" element={<PostPage />} />
          <Route path="/Write" element={<WritePage />} />
          <Route path="/History" element={<HistoryPage />} />
          <Route path="/Options" element={<OptionPage />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
