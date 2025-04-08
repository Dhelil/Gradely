import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Register.css';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        surname: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:4000/user/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email,
                    password: formData.password,
                    phone_number: formData.phoneNumber,
                    address: formData.address
                }), 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register');
            }

            navigate("/login", { state: { registrationSuccess: true } });
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h2 className="register-header">Create Account</h2>
                {error && <p className="register-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="register-form-group">
                        <label className="register-label">Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="register-input"
                        />
                    </div>

                    <div className="register-form-group">
                        <label className="register-label">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="register-input"
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label className="register-label">Surname:</label>
                        <input
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            className="register-input"
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label className="register-label">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="register-input"
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label className="register-label">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="register-input"
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label className="register-label">Phone Number:</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="register-input"
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label className="register-label">Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="register-input"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="register-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <div className="login-footer">
                <p>
                    Déjà un compte ?{' '}
                    <a href="/login" className="login-link">
                    Se connecter
                    </a>
                </p>
                </div>
            </div>
        </div>
    );
};

export default Register;