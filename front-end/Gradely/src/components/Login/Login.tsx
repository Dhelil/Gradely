import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

interface UserData {
  id: string;
  name: string;
  surname: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: UserData;
}

interface LoginProps {
  setUser: (user: UserData | null) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingUser, setExistingUser] = useState<UserData | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as UserData;
        setExistingUser(parsedUser);
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:4000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data as any); // si tu veux afficher un message de l'API plus tard
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      navigate('/');
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la connexion'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Connexion</h2>

        {existingUser ? (
          <div className="already-logged-in">
            <p>Vous êtes déjà connecté en tant que : <strong>{existingUser.name} {existingUser.surname}</strong></p>
            <button
              className="home-button"
              onClick={() => navigate('/')}
            >
              Retour à l'accueil
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="login-error">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="login-footer">
              <p>
                Pas encore de compte ?{' '}
                <a href="/register" className="register-link">
                  S'inscrire
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
