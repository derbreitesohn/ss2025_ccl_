import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:3000';

function AddListing() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        user_id: '',
        pet_name: '',
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
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Create New Listing</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Listing Type:
                            <select
                                name="listing_type"
                                value={formData.listing_type}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            >
                                <option value="adoption">Adoption</option>
                                <option value="playdate">Playdate</option>
                                <option value="walking">Dog Walking</option>
                            </select>
                        </label>
                    </div>

                    {[
                        { label: 'Pet Name', name: 'pet_name', type: 'text' },
                        { label: 'Breed', name: 'breed', type: 'text' },
                        { label: 'Age', name: 'age', type: 'number' },
                        { label: 'Gender', name: 'gender', type: 'text' },
                        { label: 'Weight', name: 'weight', type: 'number' },
                        { label: 'Color', name: 'color', type: 'text' },
                        { label: 'Location', name: 'location', type: 'text' },
                        { label: 'Photo URL', name: 'photo_url', type: 'url' }
                    ].map(({ label, name, type }) => (
                        <div key={name}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                {label}:
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    required={name !== 'photo_url'}
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

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            About:
                            <textarea
                                name="about"
                                value={formData.about}
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
                        Create Listing
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddListing;
