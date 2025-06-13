import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:3000';

function AddPet() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        age: '',
        description: '',
        image_url: ''
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
        try {
            await axios.post(`${API_BASE_URL}/pets`, formData, {
                withCredentials: true
            });
            navigate('/profile');
        } catch (error) {
            console.error('Error adding pet:', error);
            alert('Failed to add pet. Please try again.');
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ marginBottom: '20px' }}>Add New Pet</h1>
                <form onSubmit={handleSubmit} style={{
                    background: '#f9f9f9',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </label>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Species:
                            <input
                                type="text"
                                name="species"
                                value={formData.species}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </label>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Breed:
                            <input
                                type="text"
                                name="breed"
                                value={formData.breed}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </label>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Age:
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </label>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Description:
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    minHeight: '100px'
                                }}
                            />
                        </label>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Image URL:
                            <input
                                type="url"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
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
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPet;