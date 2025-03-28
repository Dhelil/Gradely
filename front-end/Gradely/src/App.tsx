import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NotesUser from './components/NotesUser/NotesUser';

interface User {
  id: string;
  name: string;
  surname: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    try {
      setUser(userData ? JSON.parse(userData) : null);
    } catch (e) {
      console.error("Erreur de parsing user:", e);
      setUser(null);
    }
  }, []);

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            {!user ? (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            ) : (
              <li><Link to={`/notes/${user.id}/notes`}>Notes</Link></li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notes/:userId/notes" element={<NotesUser />} />
          <Route 
            path="/notes" 
            element={user ? <Navigate to={`/notes/${user.id}/notes`} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;