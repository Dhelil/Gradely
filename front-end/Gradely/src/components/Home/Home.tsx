import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  surname: string;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    try {
      setUser(userData ? JSON.parse(userData) : null);
    } catch (e) {
      console.error("Erreur de parsing user:", e);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      <p>This is the home page</p>
      {user ? (
        <div>
          <p>Vous êtes connecté en tant que : {user.name} {user.surname}</p>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      ) : (
        <p>Vous n'êtes pas connecté.</p>
      )}
    </div>
  );
};

export default Home;