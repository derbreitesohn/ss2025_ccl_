import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import loginImage from '../images/fee_ccl.png';
import logo from '../images/logo_patpat.png';

const API_BASE_URL = 'https://cc241045-10757.node.fhstp.cc/api';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (data.Login === "success") {
                console.log('Login successful, redirecting to profile...');
                navigate('/profile');
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-split-container">
            <div className="login-form-section">
                <div className="login-form-content">
                    <div className="login-header">
                        <div className="logo-section">
                            <div className="logo-placeholder">
                                <img
                                    src={logo}
                                    alt="logo"
                                    className="logo-image"
                                />
                            </div>
                        </div>
                        <p className="tagline">Find your perfect companion</p>
                    </div>

                    <div className="welcome-section">
                        <h1 className="welcome-title">Welcome back</h1>
                        <p className="welcome-subtitle">Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="form-container">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="form-input"
                                placeholder="Enter your Username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-input"
                                placeholder="Enter your Password"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`signin-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/signup" className="signup-link">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="photo-section">
                <div className="photo-container">
                    <img
                        src={loginImage}
                        alt="Beautiful dog companion"
                        className="login-image"
                    />
                    <div className="photo-overlay"></div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
