import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './style.css';

const API_BASE_URL = 'http://localhost:3000';

function AddPet() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        user_id: '',
        name: '',
        pet_type: '',
        animal: '',
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
                    withCredentials: true
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
                    pet_type: formData.pet_type,
                    animal: formData.animal,
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
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <h1 className="h4 mb-4">Add New Pet</h1>
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
                                { label: 'Image URL', name: 'image_url', type: 'url' }
                            ].map(({ label, name, type }) => (
                                <div key={name} className="form-group">
                                    <label>
                                        {label}:
                                        <input
                                            type={type}
                                            name={name}
                                            value={formData[name]}
                                            onChange={handleChange}
                                            required={name !== 'image_url'}
                                            className="form-control"
                                        />
                                    </label>
                                </div>
                            ))}

                            <div className="form-group">
                                <label>
                                    Description:
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                        style={{ minHeight: '100px' }}
                                    />
                                </label>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Add Pet
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
