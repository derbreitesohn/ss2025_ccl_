import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './style.css';

const API_BASE_URL = 'https://cc241045-10757.node.fhstp.cc/api';

function EditListing() {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [listingResponse, petsResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/listings/${id}`, { withCredentials: true }),
                    axios.get(`${API_BASE_URL}/pets`, { withCredentials: true })
                ]);
                setFormData(listingResponse.data.listing);
            } catch (err) {
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
        try {

            await axios.post(`${API_BASE_URL}/listings/${id}`, formData, { withCredentials: true });

            const petsResponse = await axios.get(`${API_BASE_URL}/pets`, { withCredentials: true });
            const pets = petsResponse.data;

            const associatedPet = pets.find(pet =>
                pet.name === formData.pet_name ||
                (pet.animal === formData.animal &&
                    pet.breed === formData.breed &&
                    pet.age === formData.age)
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
                    description: formData.about,
                    image_url: formData.photo_url,
                    pet_type: formData.listing_type
                };
                await axios.post(`${API_BASE_URL}/pets/${associatedPet.id}`, updatedPet, { withCredentials: true });
            }

            navigate(`/listings/${id}`);
        } catch (err) {
            setError('Failed to update listing');
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
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Listing Type:
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

export default EditListing;