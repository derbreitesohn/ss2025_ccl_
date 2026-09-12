import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './style.css';

import { API_BASE_URL } from '../api';
import { useAuth } from '../auth';

function AddPet() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        user_id: user.id,
        name: '',
        pet_type: 'playdate',
        animal: 'dog',
        breed: '',
        age: '',
        gender: '',
        weight: '',
        color: '',
        location: '',
        about: '',
        pet_picture: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            await axios.post(`${API_BASE_URL}/pets/add`, formData, { withCredentials: true, timeout: 10000 });
            navigate('/profile');
        } catch (error) {
            console.error('Error adding pet:', error.response?.data);
            setError('Failed to add pet. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <h1 className="h4 mb-4">Add New Pet</h1>
                        {error && <p className="notice error" role="alert">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            {[
                                { label: 'Name', name: 'name', type: 'text' },
                                { label: 'Pet Type', name: 'pet_type', type: 'text' },
                                { label: 'Breed', name: 'breed', type: 'text' },
                                { label: 'Animal', name: 'animal', type: 'text' },
                                { label: 'Age', name: 'age', type: 'number' },
                                { label: 'Gender', name: 'gender', type: 'text' },
                                { label: 'Weight (kg)', name: 'weight', type: 'number' },
                                { label: 'Color', name: 'color', type: 'text' },
                                { label: 'Location', name: 'location', type: 'text' },
                                { label: 'Image URL', name: 'pet_picture', type: 'url' }
                            ].map(({ label, name, type }) => (
                                <div key={name} className="form-group">
                                    <label htmlFor={`add-pet-${name}`}>
                                        {label}:
                                    </label>
                                        {name === 'pet_type' || name === 'animal' ? <select id={`add-pet-${name}`} name={name} value={formData[name]} onChange={handleChange} className="form-control">
                                            {(name === 'pet_type' ? [['playdate', 'Playdate'], ['adoption', 'Adoption']] : [['dog', 'Dog'], ['cat', 'Cat'], ['other', 'Other']]).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
                                        </select> : <input
                                            id={`add-pet-${name}`}
                                            type={type}
                                            min={type === 'number' ? 0 : undefined}
                                            step={type === 'number' ? 'any' : undefined}
                                            name={name}
                                            value={formData[name]}
                                            onChange={handleChange}
                                            required={name !== 'pet_picture'}
                                            className="form-control"
                                        />}
                                </div>
                            ))}

                            <div className="form-group">
                                <label htmlFor="add-pet-about">
                                    Description:
                                </label>
                                    <textarea
                                        id="add-pet-about"
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                        style={{ minHeight: '100px' }}
                                    />
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Please wait…' : 'Add Pet'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/profile')}
                                    className="btn btn-danger"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddPet;
