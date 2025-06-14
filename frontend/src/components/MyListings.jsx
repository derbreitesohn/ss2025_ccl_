import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:3000';

function MyListings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/listings`, {
                    withCredentials: true
                });
                setListings(response.data.listings);
            } catch (err) {
                console.error('Error fetching listings:', err);
                setError('Failed to load listings. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    if (loading) {
        return (
            <div>
                <Navbar />
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>Loading listings...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1>My Listings</h1>
                    <button
                        onClick={() => navigate('/add-listing')}
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
                        Add New Listing
                    </button>
                </div>

                {error && (
                    <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
                        {error}
                    </div>
                )}

                {listings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
                        <p>You haven't created any listings yet.</p>
                        <p>Click the "Add New Listing" button to create your first listing!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {listings.map(listing => (
                            <div
                                key={listing.id}
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    background: 'white'
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
                                            borderRadius: '4px',
                                            marginBottom: '15px'
                                        }}
                                    />
                                )}
                                <h3>{listing.pet_name}</h3>
                                <p><strong>Type:</strong> {listing.listing_type}</p>
                                <p><strong>Breed:</strong> {listing.breed}</p>
                                <p><strong>Age:</strong> {listing.age}</p>
                                <p><strong>Location:</strong> {listing.location}</p>
                                <div style={{ marginTop: '15px' }}>
                                    <button
                                        onClick={() => navigate(`/listings/${listing.id}/edit`)}
                                        style={{
                                            padding: '8px 15px',
                                            backgroundColor: '#2196F3',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '10px'
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {/* Add delete functionality */}}
                                        style={{
                                            padding: '8px 15px',
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyListings;