import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:3000';

function EditPet() {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/pets/${id}`, { withCredentials: true })
            .then(res => setFormData(res.data))
            .catch(() => setError('Failed to load pet'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/pets/${id}`, formData, { withCredentials: true });
            navigate(`/pets/${id}`);
        } catch (err) {
            setError('Failed to update pet');
        }
    };

    if (loading) return <div><Navbar /><p>Loading...</p></div>;
    if (error) return <div><Navbar /><p style={{color: 'red'}}>{error}</p></div>;
    if (!formData) return <div><Navbar /><p>No pet found.</p></div>;

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 32 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24 }}>Edit Pet</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <label>Name:<input name="name" value={formData.name || ''} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                    <label>Animal:<input name="animal" value={formData.animal || ''} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                    <label>Breed:<input name="breed" value={formData.breed || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                    <label>Age:<input name="age" value={formData.age || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                    <label>Gender:<input name="gender" value={formData.gender || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                    <label>Weight:<input name="weight" value={formData.weight || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                    <label>Color:<input name="color" value={formData.color || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                    <label>Location:<input name="location" value={formData.location || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                    <label>About:<input name="about" value={formData.about || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                    <label>Picture URL:<input name="pet_picture" value={formData.pet_picture || ''} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} /></label>
                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <button type="submit" style={{ flex: 1, padding: '10px 0', background: '#7C3AED', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Save</button>
                        <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, padding: '10px 0', background: '#ccc', color: 'black', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditPet;