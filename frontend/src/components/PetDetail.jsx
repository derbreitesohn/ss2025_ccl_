import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_BASE_URL = 'https://cc241045-10757.node.fhstp.cc/api';

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
            <div className="detail-card" style={{position: 'relative'}}>
                {pet.pet_picture && (
                    <div style={{ position: 'relative' }}>
                        <img src={pet.pet_picture} alt={pet.name} />
                        <span className="listing-badge" style={{ top: 18, right: 18, left: 'unset', bottom: 'unset' }}>{pet.pet_type ? pet.pet_type.charAt(0).toUpperCase() + pet.pet_type.slice(1) : ''}</span>
                        <div style={{ textAlign: 'right', color: '#888', fontWeight: 500, marginTop: 8, marginBottom: 8, fontSize: '1.08rem' }}>{pet.location}</div>
                    </div>
                )}
                <h1 className={'h1-centered'}>{pet.name}</h1>
                <div className="detail-box-grid">
                    <div className="detail-box"><div className="detail-box-label">Age</div><div className="detail-box-value">{pet.age}</div></div>
                    <div className="detail-box"><div className="detail-box-label">Gender</div><div className="detail-box-value">{pet.gender}</div></div>
                    <div className="detail-box"><div className="detail-box-label">Weight</div><div className="detail-box-value">{pet.weight}</div></div>
                    <div className="detail-box"><div className="detail-box-label">Color</div><div className="detail-box-value">{pet.color}</div></div>
                    <div className="detail-box"><div className="detail-box-label">Breed</div><div className="detail-box-value">{pet.breed}</div></div>
                    <div className="detail-box"><div className="detail-box-label">Animal</div><div className="detail-box-value">{pet.animal}</div></div>
                </div>
                <div style={{margin: '32px 0 18px 0', textAlign: 'left'}}>
                    <div className="detail-info-list-item"><span className="detail-info-label">About:</span> {pet.about}</div>
                </div>
                {user && user.id === pet.user_id && (
                    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                        <button onClick={() => navigate(`/edit-pet/${pet.id}`)} style={{ flex: 1, padding: '10px 0', background: '#E0E7FF', color: '#000000', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Edit</button>
                        <button onClick={handleDelete} style={{ flex: 1, padding: '10px 0', background: '#ef6666', color: '#ffffff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PetDetail;