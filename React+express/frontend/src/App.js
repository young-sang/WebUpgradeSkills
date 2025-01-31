import { HashRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Footer from './component/Footer.js';
import Header from './component/Header.js';
import Main from './component/Main/Main.js';


function App() {
  return (
    <Router basename={"https://young-sang.github.io/WebUpgradeSkills/"}>
      <Header />
      <Main />
      <Footer />
    </Router>
  );
}

export default App;
