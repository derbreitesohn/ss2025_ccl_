import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:3000';

function Profile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/users/${id}`);
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Failed to load user data');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserData();
        }
    }, [id]);

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
                )}
            </div>
        </div>
    );
}

export default Profile;
