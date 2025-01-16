import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from './component/Footer.js';
import Header from './component/Header.js';
import Main from './component/Main.js';


function App() {
  return (
    <Router>
      <Header />
      <Main />
      <Footer />
    </Router>
  );
}

export default App;
