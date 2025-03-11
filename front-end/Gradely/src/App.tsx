import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App() {

  return (
    <Router>
      <div>
        <nav>
          <ul>x
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        <Routes>
        </Routes>
      </div>
    </Router>
  );
}

export default App;