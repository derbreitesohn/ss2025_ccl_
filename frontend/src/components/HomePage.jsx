import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:3000';

function HomePage() {
    const [listings, setListings] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/listings`)
            .then(response => {
                setListings(response.data.listings);
            })
            .catch(error => {
                console.error('Error fetching listings:', error);
                setError('Failed to load listings');
            });
    }, []);

    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>
            <Navbar />
            <div className="page-content" style={{ maxWidth: '1300px', margin: '0 auto', padding: '30px 20px' }}>
                <h1 style={{ fontWeight: 700, fontSize: '2.5rem', marginBottom: '10px', color: '#222' }}>Browse Current Listings</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px', marginTop: '30px' }}>
                    {listings.map(listing => (
                        <div
                            key={listing.id}
                            style={{
                                background: '#fff',
                                border: '1.5px solid #e5e5e5',
                                borderRadius: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                padding: '0 0 20px 0',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                position: 'relative',
                                minHeight: '420px'
                            }}
                        >
                            {listing.photo_url && (
                                <img
                                    src={listing.photo_url}
                                    alt={listing.pet_name}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderTopLeftRadius: '16px',
                                        borderTopRightRadius: '16px',
                                        marginBottom: '12px'
                                    }}
                                />
                            )}
                            <div style={{ padding: '0 20px', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{
                                        background: listing.listing_type === 'adoption' ? '#6C63FF' : '#FFB347',
                                        color: '#fff',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        padding: '3px 12px',
                                        marginRight: '10px',
                                        textTransform: 'capitalize'
                                    }}>{listing.listing_type}</span>
                                    <span style={{ color: '#888', fontSize: '0.95rem' }}>{listing.location}</span>
                                </div>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 6px 0', color: '#222' }}>{listing.pet_name}</h2>
                                <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: '4px' }}><strong>Breed:</strong> {listing.breed}</div>
                                <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: '4px' }}><strong>Age:</strong> {listing.age}</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '0 20px' }}>
                                <button
                                    onClick={() => navigate('/messages')}
                                    style={{
                                        flex: 1,
                                        padding: '10px 0',
                                        background: '#7C3AED',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        marginTop: '12px'
                                    }}
                                >
                                    Contact
                                </button>
                                <button
                                    onClick={() => navigate(`/listings/${listing.id}`)}
                                    style={{
                                        flex: 1,
                                        padding: '10px 0',
                                        background: '#fff',
                                        color: '#7C3AED',
                                        border: '2px solid #7C3AED',
                                        borderRadius: '6px',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        marginTop: '12px'
                                    }}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage;