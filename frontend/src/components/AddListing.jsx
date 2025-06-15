import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './style.css';

const API_BASE_URL = 'http://localhost:3000';

function AddListing() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [formData, setFormData] = useState({
        user_id: '',
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
                    axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true }),
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
            pet_name: pet.name,
            animal: pet.animal,
            breed: pet.breed,
            age: pet.age,
            gender: pet.gender,
            weight: pet.weight,
            color: pet.color,
            location: pet.location,
            about: pet.description,
            photo_url: pet.image_url
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/listings/add`, formData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            navigate('/listings');
        } catch (err) {
            console.error('Error creating listing:', err);
            setError('Failed to create listing. Please try again.');
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

                        {pets.length > 0 && (
                            <div className="mb-4">
                                <h5>Choose an existing pet or create a new listing:</h5>
                                <div className="pets-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                                    {pets.map(pet => (
                                        <div
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
                                            {pet.image_url && (
                                                <img
                                                    src={pet.image_url}
                                                    alt={pet.name}
                                                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
                                                />
                                            )}
                                            <h6 style={{ margin: '0 0 4px 0' }}>{pet.name}</h6>
                                            <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>{pet.breed}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>
                                    Listing Type:
                                    <select
                                        name="listing_type"
                                        value={formData.listing_type}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        <option value="adoption">Adoption</option>
                                        <option value="playdate">Playdate</option>
                                    </select>
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Pet Name:
                                    <input
                                        name="pet_name"
                                        value={formData.pet_name}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Animal:
                                    <input
                                        name="animal"
                                        value={formData.animal}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Breed:
                                    <input
                                        name="breed"
                                        value={formData.breed}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Age:
                                    <input
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Gender:
                                    <input
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Weight:
                                    <input
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Color:
                                    <input
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Location:
                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label>About:
                                    <textarea
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="4"
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Photo URL:
                                    <input
                                        name="photo_url"
                                        value={formData.photo_url}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </label>
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary flex-grow-1">Create Listing</button>
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
