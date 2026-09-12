import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './style.css';

import { API_BASE_URL } from '../api';

function EditPet() {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const petResponse = await axios.get(`${API_BASE_URL}/pets/${id}`, { withCredentials: true });
                setFormData(petResponse.data);
            } catch {
                setError('Failed to load pet');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        setSaveError('');
        try {
            await axios.post(`${API_BASE_URL}/pets/${id}`, formData, { withCredentials: true });

            const listingsResponse = await axios.get(`${API_BASE_URL}/listings`, { withCredentials: true });
            const listings = listingsResponse.data.listings;

            const associatedListings = listings.filter(listing =>
                listing.pet_id != null && String(listing.pet_id) === String(id) &&
                String(listing.user_id) === String(formData.user_id)
            );

            for (const listing of associatedListings) {
                const updatedListing = {
                    ...listing,
                    pet_name: formData.name,
                    animal: formData.animal,
                    breed: formData.breed,
                    age: formData.age,
                    gender: formData.gender,
                    weight: formData.weight,
                    color: formData.color,
                    location: formData.location,
                    about: formData.about,
                    photo_url: formData.pet_picture
                };
                await axios.post(`${API_BASE_URL}/listings/${listing.id}`, updatedListing, { withCredentials: true });
            }

            navigate(`/pets/${id}`);
        } catch {
            setSaveError('We couldn’t finish saving your pet and linked listings. Your details are still here; please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div><Navbar /><p className="text-center">Loading...</p></div>;
    if (error) return <div><Navbar /><p className="alert alert-danger">{error}</p></div>;
    if (!formData) return <div><Navbar /><p className="text-center">No pet found.</p></div>;

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <h1 className="h4 mb-4">Edit Pet</h1>
                        {saveError && <p className="notice error" role="alert">{saveError}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="edit-pet-name">Name:</label>
                                    <input id="edit-pet-name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-pet-pet_type">Pet Type:</label>
                                    <select id="edit-pet-pet_type"
                                        name="pet_type"
                                        value={formData.pet_type}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        <option value="adoption">Adoption</option>
                                        <option value="playdate">Playdate</option>
                                    </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-pet-animal">Animal:</label>
                                    <input id="edit-pet-animal"
                                        name="animal"
                                        value={formData.animal}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-pet-breed">Breed:</label>
                                    <input id="edit-pet-breed"
                                        name="breed"
                                        value={formData.breed}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-pet-age">Age:</label>
                                    <input id="edit-pet-age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-pet-gender">Gender:</label>
                                    <input id="edit-pet-gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-pet-weight">Weight:</label>
                                    <input id="edit-pet-weight"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-pet-color">Color:</label>
                                    <input id="edit-pet-color"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-pet-location">Location:</label>
                                    <input id="edit-pet-location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-pet-about">Description:</label>
                                    <textarea id="edit-pet-about"
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="4"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-pet-pet_picture">Image URL:</label>
                                    <input id="edit-pet-pet_picture"
                                        name="pet_picture"
                                        value={formData.pet_picture}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary flex-grow-1" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                                <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary flex-grow-1">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditPet;
