import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Créez ce fichier CSS pour les styles

interface User {
  id: string;
  name: string;
  surname: string;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Impossible de charger les informations utilisateur");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    
    const handleStorageChange = () => {
      fetchUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="home-container">
        <div className="home-content">
          <p>Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <h2>Welcome to the Home Page</h2>
        <p>This is the home page</p>
        
        {error && <p className="error-message">{error}</p>}
        
        {user ? (
          <div className="user-section">
            <p>Vous êtes déjà connecté</p>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="auth-section">
            <p>Vous n'êtes pas connecté.</p>
            <button 
              onClick={() => navigate('/login')}
              className="login-button"
            >
              Se connecter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;