import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


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
        <div>
            <h1>Register</h1>
            {error && <div style={{color: 'red'}}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange} />
                <input name="username" placeholder="Username" onChange={handleChange} />
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="password" placeholder="Password" type="password" onChange={handleChange} />
                <input name="location" placeholder="Location" onChange={handleChange} />
                <input name="profile_picture" placeholder="Profile Picture" onChange={handleChange} />
                <input name="about" placeholder="About" onChange={handleChange} />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Sign Up'}
                </button>
            </form>
        </div>

    );
}

export default SignUp;