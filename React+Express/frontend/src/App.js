import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from './component/Footer.js';
import Header from './component/Header.js';

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={< />}></Route>
          <Route path="/" element={< />}></Route>
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
