import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './style.css';

const API_BASE_URL = 'http://localhost:3000';

function EditPet() {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [petResponse, listingsResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/pets/${id}`, { withCredentials: true }),
                    axios.get(`${API_BASE_URL}/listings`, { withCredentials: true })
                ]);
                setFormData(petResponse.data);
            } catch (err) {
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
        try {
            // Update pet
            await axios.post(`${API_BASE_URL}/pets/${id}`, formData, { withCredentials: true });

            // Get all listings
            const listingsResponse = await axios.get(`${API_BASE_URL}/listings`, { withCredentials: true });
            const listings = listingsResponse.data.listings;

            // Find and update associated listings
            const associatedListings = listings.filter(listing =>
                listing.pet_name === formData.name ||
                (listing.animal === formData.animal &&
                    listing.breed === formData.breed &&
                    listing.age === formData.age)
            );

            // Update each associated listing
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
                    about: formData.description,
                    photo_url: formData.image_url
                };
                await axios.post(`${API_BASE_URL}/listings/${listing.id}`, updatedListing, { withCredentials: true });
            }

            navigate(`/pets/${id}`);
        } catch (err) {
            setError('Failed to update pet');
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
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name:
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Pet Type:
                                    <select
                                        name="pet_type"
                                        value={formData.pet_type}
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
                                <label>Description:
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="4"
                                    />
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Image URL:
                                    <input
                                        name="image_url"
                                        value={formData.image_url}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </label>
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary flex-grow-1">Save</button>
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