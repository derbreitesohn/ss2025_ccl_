import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:3000';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/users/me`, {
                    withCredentials: true // This ensures cookies are sent with the request
                });
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Failed to load user data. Please make sure you are logged in.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div>
                <Navbar />
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ color: 'red' }}>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '8px 16px',
                            marginTop: '10px',
                            cursor: 'pointer'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ marginBottom: '20px' }}>My Profile</h1>

                {user && (
                    <div style={{
                        background: '#f9f9f9',
                        padding: '20px',
                        borderRadius: '8px'
                    }}>
                        <div style={{color: 'black'}}>
                            <h2>User Information</h2>

                            {user.profile_picture && (
                                <div style={{ marginBottom: '15px' }}>
                                    <img
                                        src={user.profile_picture}
                                        alt="Profile"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            )}

                            <div style={{ marginBottom: '10px' }}>
                                <strong>Name: </strong>
                                <span>{user.name || 'Not specified'}</span>
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <strong>Username: </strong>
                                <span>{user.username}</span>
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <strong>Email: </strong>
                                <span>{user.email}</span>
                            </div>

                            {user.location && (
                                <div style={{ marginBottom: '10px' }}>
                                    <strong>Location: </strong>
                                    <span>{user.location}</span>
                                </div>
                            )}

                            {user.about && (
                                <div style={{ marginBottom: '10px' }}>
                                    <strong>About: </strong>
                                    <p>{user.about}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* My Pets Section */}
                <div style={{ marginTop: '30px' }}>
                    <h2>My Pets</h2>
                    <div style={{
                        background: '#f9f9f9',
                        padding: '20px',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <p style={{ marginBottom: '20px' }}>You haven't added any pets yet.</p>
                        <button
                            onClick={() => navigate('/add-pet')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Add Pet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
