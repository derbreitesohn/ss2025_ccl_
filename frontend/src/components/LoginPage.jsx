import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import './LoginPage.css';
import loginImage from '../images/fee_ccl.png'
import logo from '../images/logo_patpat.png'

const API_BASE_URL = 'http://localhost:3000';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            navigate('/')

            // Store the token (you can uncomment this when ready to use localStorage)
            // localStorage.setItem('token', data.token);

            // Redirect to home page or dashboard
            console.log('Login successful:', data);
            // navigate('/home'); // uncomment when using react-router

        } catch (error) {
            setError(error.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-split-container">
            {/* Left Side - Login Form */}
            <div className="login-form-section">
                <div className="login-form-content">
                    {/* Logo and Header */}
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

                    {/* Welcome Text */}
                    <div className="welcome-section">
                        <h1 className="welcome-title">Welcome back</h1>
                        <p className="welcome-subtitle">Sign in to your account to continue</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="form-container">
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
                            onClick={handleLogin}
                            className={`signin-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="login-footer">
                        <p>Don't have an account? <a href="#" className="signup-link">Sign up</a></p>
                    </div>
                </div>
            </div>

            {/* Right Side - Dog Photo */}
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