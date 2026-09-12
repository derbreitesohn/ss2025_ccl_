import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './style.css';

import { API_BASE_URL } from '../api';

function EditListing() {
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
                const listingResponse = await axios.get(`${API_BASE_URL}/listings/${id}`, { withCredentials: true });
                setFormData(listingResponse.data.listing);
            } catch {
                setError('Failed to load listing');
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

            await axios.post(`${API_BASE_URL}/listings/${id}`, formData, { withCredentials: true });

            const petsResponse = await axios.get(`${API_BASE_URL}/pets`, { withCredentials: true });
            const pets = petsResponse.data;

            const associatedPet = pets.find(pet =>
                formData.pet_id != null && String(pet.id) === String(formData.pet_id) &&
                String(pet.user_id) === String(formData.user_id)
            );

            if (associatedPet) {
                const updatedPet = {
                    ...associatedPet,
                    name: formData.pet_name,
                    animal: formData.animal,
                    breed: formData.breed,
                    age: formData.age,
                    gender: formData.gender,
                    weight: formData.weight,
                    color: formData.color,
                    location: formData.location,
                    about: formData.about,
                    pet_picture: formData.photo_url,
                    pet_type: formData.listing_type
                };
                await axios.post(`${API_BASE_URL}/pets/${associatedPet.id}`, updatedPet, { withCredentials: true });
            }

            navigate(`/listings/${id}`);
        } catch {
            setSaveError('We couldn’t finish saving this listing and its pet. Your details are still here; please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div><Navbar /><p className="text-center">Loading...</p></div>;
    if (error) return <div><Navbar /><p className="alert alert-danger">{error}</p></div>;
    if (!formData) return <div><Navbar /><p className="text-center">No listing found.</p></div>;

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <h1 className="h4 mb-4">Edit Listing</h1>
                        {saveError && <p className="notice error" role="alert">{saveError}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="edit-listing-listing_type">Listing Type:</label>
                                    <select id="edit-listing-listing_type"
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
                                <label htmlFor="edit-listing-pet_name">Pet Name:</label>
                                    <input id="edit-listing-pet_name"
                                        name="pet_name"
                                        value={formData.pet_name}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-listing-animal">Animal:</label>
                                    <input id="edit-listing-animal"
                                        name="animal"
                                        value={formData.animal}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-listing-breed">Breed:</label>
                                    <input id="edit-listing-breed"
                                        name="breed"
                                        value={formData.breed}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-listing-age">Age:</label>
                                    <input id="edit-listing-age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-listing-gender">Gender:</label>
                                    <input id="edit-listing-gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-listing-weight">Weight:</label>
                                    <input id="edit-listing-weight"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-listing-color">Color:</label>
                                    <input id="edit-listing-color"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-listing-location">Location:</label>
                                    <input id="edit-listing-location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-listing-about">About:</label>
                                    <textarea id="edit-listing-about"
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="4"
                                    />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-listing-photo_url">Photo URL:</label>
                                    <input id="edit-listing-photo_url"
                                        name="photo_url"
                                        value={formData.photo_url}
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

export default EditListing;
