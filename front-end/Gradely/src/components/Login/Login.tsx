import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:4000/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to login');
            }

            const { token } = await response.json();
            
            // Stockage du seul token
            localStorage.setItem('token', token);
            
            setIsLoggedIn(true);
            navigate("/");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        // Suppression du seul token
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-header">Login</h2>
                {error && <p className="login-error">{error}</p>}

                {!isLoggedIn ? (
                    <form onSubmit={handleSubmit}>
                        <div className="login-form-group">
                            <label className="login-label">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                                required
                            />
                        </div>
                        <div className="login-form-group">
                            <label className="login-label">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <p>Vous êtes déjà connecté</p>
                        <button 
                            onClick={handleLogout}
                            className="login-button logout-button"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;