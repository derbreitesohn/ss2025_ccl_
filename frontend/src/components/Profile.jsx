import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import LoginPage from "./LoginPage.jsx";

const API_BASE_URL = 'http://localhost:3000';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/users/me`, {
                    withCredentials: true // This ensures cookies are sent with the request
                });
                setUser(response.data);
                console.log(response.data);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Failed to load user data. Please make sure you are logged in.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleEditClick = () => {
        setEditData(user);
        setEditMode(true);
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/users/${user.id}`, editData, { withCredentials: true });
            setUser(editData);
            setEditMode(false);
        } catch (err) {
            alert('Error updating user');
        }
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: 'white', color: 'black' }}>
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

                {user && !editMode && (
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
                            <button onClick={handleEditClick} style={{marginTop: '16px', padding: '8px 20px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer'}}>Edit User</button>
                        </div>
                    </div>
                )}
                {editMode && (
                    <form onSubmit={handleEditSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
                        <h2>Edit User</h2>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Name: <input name="name" value={editData.name || ''} onChange={handleEditChange} /></label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Username: <input name="username" value={editData.username || ''} onChange={handleEditChange} /></label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Email: <input name="email" value={editData.email || ''} onChange={handleEditChange} /></label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Location: <input name="location" value={editData.location || ''} onChange={handleEditChange} /></label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>About: <input name="about" value={editData.about || ''} onChange={handleEditChange} /></label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Profile Picture URL: <input name="profile_picture" value={editData.profile_picture || ''} onChange={handleEditChange} /></label>
                        </div>
                        <button type="submit" style={{ padding: '8px 20px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Save</button>
                        <button type="button" onClick={() => setEditMode(false)} style={{ marginLeft: '10px', padding: '8px 20px', background: '#ccc', color: 'black', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>
                    </form>
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
