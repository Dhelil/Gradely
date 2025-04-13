import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NotesUser from './components/NotesUser/NotesUser';
import AdminNotes from './components/AdminNotes/AdminNotes';

interface User {
  id: string;
  name: string;
  surname: string;
  email?: string;
  role?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Erreur de parsing user:", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsAuthChecked(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  if (!isAuthChecked) {
    return <div>Vérification de l'authentification...</div>;
  }

  return (
    <Router>
      <div>
        <nav>
          <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', alignItems: 'center' }}>
            <li><Link to="/">Home</Link></li>
            {!user ? (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            ) : (
              <>
                <li><Link to={`/notes/${user.id}/notes`}>Mes notes</Link></li>
                {user.role === 'admin' && <li><Link to="/notes">Toutes les notes</Link></li>}
                <li style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Connecté en tant que : {user.name}
                  <button 
                    onClick={handleLogout}
                    style={{
                      padding: '0.3rem 0.6rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Déconnexion
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/notes/:userId/notes" 
            element={
              user ? <NotesUser /> : <Navigate to="/login" state={{ from: 'notes' }} />
            } 
          />
          <Route 
            path="/notes" 
            element={
              user && user.role === 'admin' ? (
                <AdminNotes />
              ) : (
                <Navigate to="/" state={{ error: "Accès refusé" }} />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
