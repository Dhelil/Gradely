import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Vérifier si l'utilisateur est déjà connecté (si le token est dans localStorage)
        const token = localStorage.getItem('token');
        if (token) {
            // Si un token est trouvé, rediriger vers la page d'accueil
            navigate('/');
        }
    }, [navigate]); // Le tableau vide [] garantit que l'effet ne se déclenche qu'une fois au montage du composant

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('http://localhost:4000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Failed to login');
            }

            const data = await response.json();
            console.log('Success:', data);
            setSuccess(true);

            // Stockage du token et de l'utilisateur dans le localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirection vers la page d'accueil ou dashboard
            navigate("/");

        } catch (err) {
            console.error('Error:', err);
            setError((err as Error).message);
        }
    };

    return (
        <div className="container">
            <h2 className="header">Login</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">Login successful!</p>}

            {/* Si l'utilisateur est déjà connecté, on affiche un message au lieu du formulaire */}
            {!localStorage.getItem('token') ? (
                <form onSubmit={handleSubmit} className="form">
                    <div className="formGroup">
                        <label htmlFor="email" className="label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="password" className="label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                        />
                    </div>
                    <button type="submit" className="button">Login</button>
                </form>
            ) : (
                <p>Vous êtes déjà connecté. Redirection vers l'accueil...</p>
            )}
        </div>
    );
};

export default Login;
