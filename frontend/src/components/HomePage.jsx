import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

function HomePage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/users`)
            .then(response => {
                setUsers(response.data); // assumes response.data is an array of users
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setError('Failed to load users');
            });
    }, []);

    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>Users:</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.username}</li> // or whatever property your user has
                ))}
            </ul>
        </div>
    );
}

export default HomePage;


