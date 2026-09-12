import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './style.css';

import { API_BASE_URL } from '../api';

function AddListing() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [formData, setFormData] = useState({
        user_id: '',
        pet_id: null,
        pet_name: '',
        animal: '',
        breed: '',
        age: '',
        gender: '',
        weight: '',
        color: '',
        location: '',
        about: '',
        photo_url: '',
        listing_type: 'adoption'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [userResponse, petsResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true }), //current user
                    axios.get(`${API_BASE_URL}/pets`, { withCredentials: true })
                ]);
                setFormData(prevState => ({
                    ...prevState,
                    user_id: userResponse.data.id,
                }));
                setPets(petsResponse.data.filter(pet => pet.user_id === userResponse.data.id));
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please make sure you are logged in.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePetSelect = (pet) => {
        setSelectedPet(pet);
        setFormData(prevState => ({
            ...prevState,
            pet_id: pet.id,
            pet_name: pet.name,
            animal: pet.animal,
            breed: pet.breed,
            age: pet.age,
            gender: pet.gender,
            weight: pet.weight,
            color: pet.color,
            location: pet.location,
            about: pet.about,
            photo_url: pet.pet_picture
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        setSaveError('');
        try {
            await axios.post(`${API_BASE_URL}/listings/add`, formData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
                timeout: 10000,
            });

            navigate('/listings');
        } catch (err) {
            console.error('Error creating listing:', err);
            setSaveError('Failed to create listing. Please try again. Your details are still here.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="container text-center">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="alert alert-danger text-center">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <h1 className="h4 text-center mb-4">Create New Listing</h1>
                        {saveError && <p className="notice error" role="alert">{saveError}</p>}

                        {pets.length > 0 && (
                            <div className="mb-4">
                                <h5>Choose an existing pet or create a new listing:</h5>
                                <div className="pets-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                                    {pets.map(pet => (
                                        <button
                                            type="button"
                                            aria-pressed={selectedPet?.id === pet.id}
                                            aria-label={`Use ${pet.name} for this listing`}
                                            key={pet.id}
                                            onClick={() => handlePetSelect(pet)}
                                            style={{
                                                padding: '16px',
                                                border: `2px solid ${selectedPet?.id === pet.id ? '#7C3AED' : '#e5e5e5'}`,
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                backgroundColor: selectedPet?.id === pet.id ? '#F3E8FF' : '#fff'
                                            }}
                                        >
                                            {pet.pet_picture && (
                                                <img
                                                    src={pet.pet_picture}
                                                    alt={pet.name}
                                                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
                                                />
                                            )}
                                            <h6 style={{ margin: '0 0 4px 0' }}>{pet.name}</h6>
                                            <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>{pet.breed}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="add-listing-listing_type">
                                    Listing Type:</label>
                                    <select id="add-listing-listing_type"
                                        name="listing_type"
                                        value={formData.listing_type}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        <option value="adoption">Adoption</option>
                                        <option value="playdate">Playdate</option>
                                    </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="add-listing-pet_name">Pet Name:</label>
                                    <input id="add-listing-pet_name"
                                        name="pet_name"
                                        value={formData.pet_name}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="add-listing-animal">Animal:</label>
                                    <input id="add-listing-animal"
                                        name="animal"
                                        value={formData.animal}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="add-listing-breed">Breed:</label>
                                    <input id="add-listing-breed"
                                        name="breed"
                                        value={formData.breed}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="add-listing-age">Age:</label>
                                    <input id="add-listing-age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="add-listing-gender">Gender:</label>
                                    <input id="add-listing-gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="add-listing-weight">Weight:</label>
                                    <input id="add-listing-weight"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="add-listing-color">Color:</label>
                                    <input id="add-listing-color"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="add-listing-location">Location:</label>
                                    <input id="add-listing-location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="add-listing-about">About:</label>
                                    <textarea id="add-listing-about"
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="4"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="add-listing-photo_url">Photo URL:</label>
                                    <input id="add-listing-photo_url"
                                        name="photo_url"
                                        value={formData.photo_url}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary flex-grow-1" disabled={saving}>{saving ? 'Saving…' : 'Create Listing'}</button>
                                <button type="button" onClick={() => navigate('/listings')} className="btn btn-secondary flex-grow-1">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddListing;
