import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import LoginPage from "./LoginPage.jsx";
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';

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
        inactive: pets.filter(p => p.inactive).length,
    };
    const filteredPets = pets.filter(pet => {
        if (activeTab === 'all') return true;
        if (activeTab === 'dogs') return (pet.animal || '').toLowerCase() === 'dog';
        if (activeTab === 'cats') return (pet.animal || '').toLowerCase() === 'cat';
        return true;
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/users/me`, {
                    withCredentials: true // This ensures cookies are sent with the request
                });
                setUser(response.data);
                // Fetch pets for this user
                const petsRes = await axios.get(`${API_BASE_URL}/pets`, { withCredentials: true });
                // Filter pets by user_id
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
        <div style={{ background: '#18181b', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 0' }}>
                {/* Profile Header Card */}
                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '32px 40px', display: 'flex', alignItems: 'center', gap: 32, marginBottom: 36 }}>
                    <img src={user?.profile_picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=PatPat'} alt="Profile" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e5e5e5' }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#222' }}>{user?.name || 'Name'}</div>
                        <div style={{ color: '#888', fontSize: '1.1rem', marginBottom: 8 }}>@{user?.username}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#888', fontSize: '1rem', marginBottom: 8 }}>
                            <span><FaMapMarkerAlt style={{ marginRight: 4 }} /> {user?.location || 'Vienna'}</span>
                            <span><BsCalendar3 style={{ marginRight: 4 }} /> Member since March 2025</span>
                        </div>
                        <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: 0 }}>{user?.about || 'Cymbro on the outside Dog lover on the inside <3'}</div>
                    </div>
                    <button onClick={handleEditClick} style={{ background: '#fff', color: '#7C3AED', border: '1.5px solid #7C3AED', borderRadius: 8, fontWeight: 600, fontSize: '1rem', padding: '10px 24px', cursor: 'pointer', transition: '0.2s', marginLeft: 16 }}>Edit Profile</button>
                </div>
                {/* Edit Profile Modal/Card */}
                {editMode && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <form onSubmit={handleEditSubmit} style={{ background: '#fff', borderRadius: 16, padding: '32px 36px', minWidth: 340, boxShadow: '0 2px 16px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem', color: '#222' }}>Edit Profile</h2>
                            <label>Name:<input name="name" value={editData.name || ''} onChange={handleEditChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                            <label>Username:<input name="username" value={editData.username || ''} onChange={handleEditChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                            <label>Email:<input name="email" value={editData.email || ''} onChange={handleEditChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                            <label>Location:<input name="location" value={editData.location || ''} onChange={handleEditChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                            <label>About:<input name="about" value={editData.about || ''} onChange={handleEditChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                            <label>Profile Picture URL:<input name="profile_picture" value={editData.profile_picture || ''} onChange={handleEditChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                                <button type="submit" style={{ flex: 1, padding: '10px 0', background: '#7C3AED', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Save</button>
                                <button type="button" onClick={() => setEditMode(false)} style={{ flex: 1, padding: '10px 0', background: '#ccc', color: 'black', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
                {/* My Pets Section */}
                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '32px 32px 40px 32px', marginBottom: 36 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                        <h2 style={{ fontWeight: 700, fontSize: '1.4rem', margin: 0, color: '#222' }}>My Pets</h2>
                        <button onClick={() => navigate('/add-pet')} style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', padding: '8px 22px', cursor: 'pointer' }}>+ Add New Pet</button>
                    </div>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                        <button onClick={() => setActiveTab('all')} style={{ background: activeTab === 'all' ? '#7C3AED' : '#f3f3f3', color: activeTab === 'all' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>All Pets ({petTypeCounts.all})</button>
                        <button onClick={() => setActiveTab('dogs')} style={{ background: activeTab === 'dogs' ? '#7C3AED' : '#f3f3f3', color: activeTab === 'dogs' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>Dogs ({petTypeCounts.dogs})</button>
                        <button onClick={() => setActiveTab('cats')} style={{ background: activeTab === 'cats' ? '#7C3AED' : '#f3f3f3', color: activeTab === 'cats' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>Cats ({petTypeCounts.cats})</button>

                    </div>
                    {/* Pet Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28 }}>
                        {filteredPets.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888', fontSize: '1.1rem' }}>No pets found.</div>
                        ) : filteredPets.map(pet => (
                            <div key={pet.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '0 0 18px 0', display: 'flex', flexDirection: 'column', alignItems: 'stretch', position: 'relative', minHeight: 320, border: '1.5px solid #e5e5e5' }}>
                                {pet.pet_picture && (
                                    <img src={pet.pet_picture} alt={pet.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12, marginBottom: 10 }} />
                                )}
                                {/* Badge */}
                                <span style={{ position: 'absolute', top: 12, right: 12, background: pet.type === 'dog' ? '#7C3AED' : '#FFB347', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', padding: '3px 12px', zIndex: 2 }}>{pet.badge || (pet.type === 'dog' ? 'Play-Date' : 'Adoption')}</span>
                                <div style={{ padding: '0 18px', flex: 1 }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '10px 0 6px 0', color: '#222' }}>{pet.name}</h3>
                                    <div style={{ color: '#444', fontSize: '1rem', marginBottom: 2 }}><strong>Breed:</strong> {pet.breed || 'Text'}</div>
                                    <div style={{ color: '#444', fontSize: '1rem', marginBottom: 2 }}><strong>Age:</strong> {pet.age || 'Text'}</div>
                                    <div style={{ color: '#444', fontSize: '1rem', marginBottom: 2 }}><strong>Gender:</strong> {pet.gender || 'Text'}</div>
                                    <div style={{ color: '#444', fontSize: '1rem', marginBottom: 2 }}><strong>Weight:</strong> {pet.weight || 'Text'}</div>
                                    <div style={{ color: '#444', fontSize: '1rem', marginBottom: 2 }}><strong>Color:</strong> {pet.color || 'Text'}</div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '0 18px' }}>
                                    <button onClick={() => navigate(`/edit-pet/${pet.id}`)} style={{ flex: 1, padding: '8px 0', background: '#E0E7FF', color: '#7C3AED', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: 12 }}>Edit</button>
                                    <button onClick={() => navigate(`/pets/${pet.id}`)} style={{ flex: 1, padding: '8px 0', background: '#fff', color: '#7C3AED', border: '2px solid #7C3AED', borderRadius: 6, fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: 12 }}>View Details</button>
                                    <button onClick={async () => {
                                        if(window.confirm('Are you sure you want to delete this pet?')) {
                                            await axios.post(`${API_BASE_URL}/pets/${pet.id}/delete`, {}, { withCredentials: true });
                                            setPets(pets.filter(p => p.id !== pet.id));
                                        }
                                    }} style={{ flex: 1, padding: '8px 0', background: '#FECACA', color: '#B91C1C', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: 12 }}>Delete</button>
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
