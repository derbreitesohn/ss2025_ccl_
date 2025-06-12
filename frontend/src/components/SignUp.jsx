import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import loginImage from '../images/fee_ccl.png';
import logo from '../images/logo_patpat.png';
import './SignUp.css';

const API_BASE_URL = 'http://localhost:3000';


function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({

        name: '',
        username: '',
        email: '',
        password: '',
        location: '',
        profile_picture: '',
        about: '',

    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // ADD THIS LINE - you were missing it
        setError(''); // Clear previous errors

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',

                body: JSON.stringify({
                    name: formData.name,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    location: formData.location,
                    profile_picture: formData.profile_picture,
                    about: formData.about,

                })
            });

            // Get response text first, then try to parse as JSON
            const responseText = await response.text();

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (jsonError) {
                // If response is not JSON, throw the raw text
                throw new Error(`Server error: ${responseText}`);
            }

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            console.log('Signup successful:', data);
            navigate('/'); // Redirect to home or dashboard

        } catch (error) {
            console.error('Signup error:', error); // Add this for debugging
            setError(error.message || 'An error occurred during Signup');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-split-container">
            {/* Left Side - Sign Up Form */}
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
                        <h1 className="welcome-title">Create an account</h1>
                        <p className="welcome-subtitle">Sign up to get started</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Sign Up Form */}
                    <form onSubmit={handleSubmit} className="form-container">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Enter your Name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Enter your Username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Enter your Email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Enter your Password"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="location" className="form-label">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter your Location"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="profile_picture" className="form-label">Profile Picture URL</label>
                            <input
                                type="text"
                                id="profile_picture"
                                name="profile_picture"
                                value={formData.profile_picture}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter picture URL"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="about" className="form-label">About</label>
                            <input
                                type="text"
                                id="about"
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Tell us about yourself"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`signin-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="login-footer">
                        <p>
                            Already have an account?{' '}
                            <a href="/login" className="signup-link">
                                Sign in
                            </a>
                        </p>
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

    export default SignUp;