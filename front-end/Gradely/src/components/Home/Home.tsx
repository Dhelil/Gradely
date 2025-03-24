import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les données de l'utilisateur depuis localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []); // Le tableau vide [] signifie que l'effet ne se déclenche qu'une fois au montage du composant

  const handleLogout = () => {
    // Supprimer le token et les informations utilisateur du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Rediriger l'utilisateur vers la page de connexion
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      <p>This is the home page</p>
      {user ? (
        <div>
          <p>Vous êtes connecté en tant que : {user.name} {user.surname}</p>
          {/* Ajouter un bouton pour se déconnecter */}
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      ) : (
        <p>Vous n'êtes pas connecté.</p>
      )}
    </div>
  );
};

export default Home;
