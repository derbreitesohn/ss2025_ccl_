import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:3000';


function AddPet() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        user_id: '',
        name: '',
        breed: '',
        age: '',
        gender: '',
        weight: '',
        color: '',
        location: '',
        description: '',
        image_url: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/users/me`, {
                    withCredentials: true // This ensures cookies are sent with the request
                });
                setFormData(prevState => ({
                    ...prevState,
                    user_id: response.data.id,
                }));
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Failed to load user data. Please make sure you are logged in.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

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
            console.log(formData);
            await axios.post(`${API_BASE_URL}/pets/add`, formData, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',

                body: JSON.stringify({
                    user_id: formData.user_id,
                    name: formData.name,
                    breed: formData.breed,
                    age: formData.age,
                    gender: formData.gender,
                    weight: formData.weight,
                    color: formData.color,
                    location: formData.location,
                    description: formData.description,
                    image_url: formData.image_url

                }),
                withCredentials: true
            });
            navigate('/profile');
        } catch (error) {
            console.error('Error adding pet:', error.response.data);
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
                    {[
                        { label: 'Name', name: 'name', type: 'text' },
                        { label: 'Breed', name: 'breed', type: 'text' },
                        { label: 'Age', name: 'age', type: 'number' },
                        { label: 'Gender', name: 'gender', type: 'text' },
                        { label: 'Weight (kg)', name: 'weight', type: 'number' },
                        { label: 'Color', name: 'color', type: 'text' },
                        { label: 'Location', name: 'location', type: 'text' },
                        { label: 'Image URL', name: 'image_url', type: 'url' }
                    ].map(({ label, name, type }) => (
                        <div key={name} style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                {label}:
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    required={name !== 'image_url'}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd'
                                    }}
                                />
                            </label>
                        </div>
                    ))}

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Description:
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
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
