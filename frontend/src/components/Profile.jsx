import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import LoginPage from "./LoginPage.jsx";
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import './style.css';

const API_BASE_URL = 'http://localhost:3000';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [pets, setPets] = useState([]);
    const [activeTab, setActiveTab] = useState('all');

    const petTypeCounts = {
        all: pets.length,
        dogs: pets.filter(p => (p.animal || '').toLowerCase() === 'dog').length,
        cats: pets.filter(p => (p.animal || '').toLowerCase() === 'cat').length,
        playdate: pets.filter(p => (p.pet_type || '').toLowerCase() === 'playdate').length,
        adoption: pets.filter(p => (p.pet_type || '').toLowerCase() === 'adoption').length,

    };

    const filteredPets = pets.filter(pet => {
        if (activeTab === 'all') return true;
        if (activeTab === 'dogs') return (pet.animal || '').toLowerCase() === 'dog';
        if (activeTab === 'cats') return (pet.animal || '').toLowerCase() === 'cat';
        if (activeTab === 'playdate') return (pet.pet_type || '').toLowerCase() === 'playdate';
        if (activeTab === 'adoption') return (pet.pet_type || '').toLowerCase() === 'adoption';
        return true;
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/users/me`, {
                    withCredentials: true
                });
                setUser(response.data);
                const petsRes = await axios.get(`${API_BASE_URL}/pets`, { withCredentials: true });
                setPets(petsRes.data.filter(pet => pet.user_id === response.data.id));
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

    const handleDeleteUser = async () => {
        if(window.confirm('Are you sure you want to delete your account? This action cannot be undone and will delete all your pets and data.')) {
            try {
                await axios.post(`${API_BASE_URL}/users/${user.id}/delete`, {}, { withCredentials: true });
                navigate('/');
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('Error deleting account. Please try again.');
            }
        }
    };


    const handleDeletePet = async (petId) => {
        if(window.confirm('Are you sure you want to delete this pet?')) {
            await axios.post(`${API_BASE_URL}/pets/${petId}/delete`, {}, { withCredentials: true });
            setPets(pets.filter(p => p.id !== petId));
        }
    };

    if (loading) {
        return (
            <div className="profile-container">
                <Navbar />
                <div className="loading-container">
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="retry-button"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-content">
                {/* Profile Header Card */}
                <div className="profile-header-card">
                    <img
                        src={user?.profile_picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=PatPat'}
                        alt="Profile"
                        className="profile-avatar"
                    />
                    <div className="profile-info">
                        <div className="profile-name">{user?.name || 'Name'}</div>
                        <div className="profile-username">@{user?.username}</div>
                        <div className="profile-meta">
                            <span className="profile-location">
                                <FaMapMarkerAlt className="icon" />
                                {user?.location || 'Vienna'}
                            </span>
                            <span className="profile-member-since">
                                <BsCalendar3 className="icon" />
                                Member since March 2025
                            </span>
                        </div>
                        <div className="profile-about">
                            {user?.about || 'Cymbro on the outside Dog lover on the inside <3'}
                        </div>
                    </div>
                    <button onClick={handleEditClick} className="edit-profile-button">
                        Edit Profile
                    </button>

                    <button onClick={handleDeleteUser} className="delete-profile-button">
                        Delete Profile
                    </button>
                </div>

                {/* Edit Profile Modal */}
                {editMode && (
                    <div className="modal-overlay">
                        <form onSubmit={handleEditSubmit} className="edit-profile-form">
                            <h2 className="form-title">Edit Profile</h2>

                            <label className="form-field">
                                Name:
                                <input
                                    name="name"
                                    value={editData.name || ''}
                                    onChange={handleEditChange}
                                    className="form-input"
                                />
                            </label>

                            <label className="form-field">
                                Username:
                                <input
                                    name="username"
                                    value={editData.username || ''}
                                    onChange={handleEditChange}
                                    className="form-input"
                                />
                            </label>

                            <label className="form-field">
                                Email:
                                <input
                                    name="email"
                                    value={editData.email || ''}
                                    onChange={handleEditChange}
                                    className="form-input"
                                />
                            </label>

                            <label className="form-field">
                                Location:
                                <input
                                    name="location"
                                    value={editData.location || ''}
                                    onChange={handleEditChange}
                                    className="form-input"
                                />
                            </label>

                            <label className="form-field">
                                About:
                                <input
                                    name="about"
                                    value={editData.about || ''}
                                    onChange={handleEditChange}
                                    className="form-input"
                                />
                            </label>

                            <label className="form-field">
                                Profile Picture URL:
                                <input
                                    name="profile_picture"
                                    value={editData.profile_picture || ''}
                                    onChange={handleEditChange}
                                    className="form-input"
                                />
                            </label>

                            <div className="form-actions">
                                <button type="submit" className="save-button">Save</button>
                                <button
                                    type="button"
                                    onClick={() => setEditMode(false)}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* My Pets Section */}
                <div className="pets-section">
                    <div className="pets-header">
                        <h2 className="pets-title">My Pets</h2>
                        <button
                            onClick={() => navigate('/add-pet')}
                            className="add-pet-button"
                        >
                            + Add New Pet
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="pets-tabs">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                        >
                            All Pets ({petTypeCounts.all})
                        </button>
                        <button
                            onClick={() => setActiveTab('dogs')}
                            className={`tab-button ${activeTab === 'dogs' ? 'active' : ''}`}
                        >
                            Dogs ({petTypeCounts.dogs})
                        </button>
                        <button
                            onClick={() => setActiveTab('cats')}
                            className={`tab-button ${activeTab === 'cats' ? 'active' : ''}`}
                        >
                            Cats ({petTypeCounts.cats})
                        </button>
                        <button
                            onClick={() => setActiveTab('playdate')}
                            className={`tab-button ${activeTab === 'playdate' ? 'active' : ''}`}
                        >
                            Playdate ({petTypeCounts.playdate})
                        </button>
                        <button
                            onClick={() => setActiveTab('adoption')}
                            className={`tab-button ${activeTab === 'adoption' ? 'active' : ''}`}
                        >
                            Adoption ({petTypeCounts.adoption})
                        </button>
                    </div>

                    {/* Pet Cards Grid */}
                    <div className="pets-grid">
                        {filteredPets.length === 0 ? (
                            <div className="no-pets-message">No pets found.</div>
                        ) : filteredPets.map(pet => (
                            <div key={pet.id} className="pet-card">
                                {pet.pet_picture && (
                                    <img
                                        src={pet.pet_picture}
                                        alt={pet.name}
                                        className="pet-image"
                                    />
                                )}

                                <span className={`pet-badge ${pet.type === 'dog' ? 'dog-badge' : 'cat-badge'}`}>
                                 {pet.badge || (pet.pet_type === 'playdate' ? 'Play-Date' : 'Adoption')}
                                </span>


                                <div className="pet-info">
                                    <h3 className="pet-name">{pet.name}</h3>
                                    <div className="pet-detail"><strong>Breed:</strong> {pet.breed || 'Text'}</div>
                                    <div className="pet-detail"><strong>Age:</strong> {pet.age || 'Text'}</div>
                                    <div className="pet-detail"><strong>Gender:</strong> {pet.gender || 'Text'}</div>
                                    <div className="pet-detail"><strong>Weight:</strong> {pet.weight || 'Text'}</div>
                                    <div className="pet-detail"><strong>Color:</strong> {pet.color || 'Text'}</div>
                                </div>

                                <div className="pet-actions">
                                    <button
                                        onClick={() => navigate(`/edit-pet/${pet.id}`)}
                                        className="edit-pet-button"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => navigate(`/pets/${pet.id}`)}
                                        className="view-pet-button"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleDeletePet(pet.id)}
                                        className="delete-pet-button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;