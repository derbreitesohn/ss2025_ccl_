import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:3000';

function PetDetail() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/pets/${id}`, { withCredentials: true })
            .then(response => setPet(response.data))
            .catch(() => setError('Failed to load pet details'))
            .finally(() => setLoading(false));
        axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, [id]);

    const handleDelete = async () => {
        if(window.confirm('Are you sure you want to delete this pet?')) {
            await axios.post(`${API_BASE_URL}/pets/${id}/delete`, {}, { withCredentials: true });
            navigate('/profile');
        }
    };

    if (loading) return <div><Navbar /><p>Loading...</p></div>;
    if (error) return <div><Navbar /><p style={{color: 'red'}}>{error}</p></div>;
    if (!pet) return <div><Navbar /><p>No pet found.</p></div>;

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: '700px', margin: '40px auto', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '32px' }}>
                {pet.pet_picture && (
                    <img src={pet.pet_picture} alt={pet.name} style={{ width: '100%', borderRadius: '12px', marginBottom: '24px' }} />
                )}
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{pet.name}</h1>
                <p><strong>Pet Type</strong> {pet.pet_type}</p>
                <p><strong>Type:</strong> {pet.animal}</p>
                <p><strong>Breed:</strong> {pet.breed}</p>
                <p><strong>Age:</strong> {pet.age}</p>
                <p><strong>Gender:</strong> {pet.gender}</p>
                <p><strong>Weight:</strong> {pet.weight}</p>
                <p><strong>Color:</strong> {pet.color}</p>
                <p><strong>Location:</strong> {pet.location}</p>
                <p><strong>About:</strong> {pet.about}</p>
                {user && user.id === pet.user_id && (
                    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                        <button onClick={() => navigate(`/edit-pet/${pet.id}`)} style={{ flex: 1, padding: '10px 0', background: '#E0E7FF', color: '#7C3AED', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Edit</button>
                        <button onClick={handleDelete} style={{ flex: 1, padding: '10px 0', background: '#FECACA', color: '#B91C1C', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PetDetail;