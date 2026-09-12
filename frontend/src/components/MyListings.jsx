import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

import { API_BASE_URL } from '../api';

function MyListings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [animalTab, setAnimalTab] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/listings/mine`, {
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

    const animalCounts = {
        all: listings.length,
        dogs: listings.filter(l => (l.animal || '').trim().toLowerCase() === 'dog').length,
        cats: listings.filter(l => (l.animal || '').trim().toLowerCase() === 'cat').length,
        playdate: listings.filter(l =>(l.listing_type || '').trim().toLowerCase() === 'playdate').length,
        adoption: listings.filter(l =>(l.listing_type || '').trim().toLowerCase() === 'adoption').length,
    };

    const filteredListings = listings.filter(listing => {
        if (animalTab === 'all') return true;
        if (animalTab === 'dogs') return (listing.animal || '').trim().toLowerCase() === 'dog';
        if (animalTab === 'cats') return (listing.animal || '').trim().toLowerCase() === 'cat';
        if (animalTab === 'playdate') return (listing.listing_type || '').trim().toLowerCase() === 'playdate';
        if (animalTab === 'adoption') return (listing.listing_type || '').trim().toLowerCase() === 'adoption';
        return true;
    });

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
        <div style={{ background: '#fff', minHeight: '100vh', color: 'black' }}>
            <Navbar />
            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '30px 20px' }}>
                <div className="mylistings-header-row">
                    <h1 className="h1-mylistings">My Listings</h1>
                    <button
                        onClick={() => navigate('/add-listing')}
                        style={{
                            background: '#7C3AED',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: '1rem',
                            padding: '8px 22px',
                            cursor: 'pointer'
                        }}
                    >
                        + Add New Listing
                    </button>
                </div>
                <div className="mylistings-filters" style={{ marginBottom: 30 }}>
                    <button onClick={() => setAnimalTab('all')} style={{ background: animalTab === 'all' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'all' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>All ({animalCounts.all})</button>
                    <button onClick={() => setAnimalTab('dogs')} style={{ background: animalTab === 'dogs' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'dogs' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>Dogs ({animalCounts.dogs})</button>
                    <button onClick={() => setAnimalTab('cats')} style={{ background: animalTab === 'cats' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'cats' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>Cats ({animalCounts.cats})</button>
                    <button onClick={() => setAnimalTab('playdate')} style={{ background: animalTab === 'playdate' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'playdate' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>Playdate ({animalCounts.playdate})</button>
                    <button onClick={() => setAnimalTab('adoption')} style={{ background: animalTab === 'adoption' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'adoption' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>Adoption ({animalCounts.adoption})</button>
                </div>
                {error && (
                    <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
                        {error}
                    </div>
                )}
                {!error && (filteredListings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
                        <p>{listings.length ? 'No listings match this filter.' : "You haven't created any listings yet."}</p>
                        {listings.length ? <button className="pat-button secondary" onClick={() => setAnimalTab('all')}>Show all listings</button> : <p>Click "+ Add New Listing" to introduce your pet to the community.</p>}
                    </div>
                ) : (
                    <div className="account-listing-grid">
                        {filteredListings.map(listing => (
                            <div key={listing.id} className="pet-card">
                                {listing.photo_url && (
                                    <img src={listing.photo_url} alt={listing.pet_name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12, marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: 'stretch', position: 'relative', minHeight: '300px', border: '1.5px solid #e5e5e5',  overflow: 'hidden', }} />

                                )}
                                {/* Badge */}
                                <span style={{ position: 'absolute', top: 12, right: 12, background: '#fff', color: '#7C3AED', border: '2px solid #7C3AED', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', padding: '3px 12px', zIndex: 2 }}>{listing.listing_type ? listing.listing_type.charAt(0).toUpperCase() + listing.listing_type.slice(1) : ''}</span>
                                <div style={{ padding: '0 18px', flex: 1 }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '20px 0 6px 0', color: '#222' }}>{listing.pet_name}</h3>
                                    <div style={{ color: '#444', fontSize: '1rem', marginBottom: 2 }}><strong>Breed:</strong> {listing.breed}</div>
                                    <div style={{ color: '#444', fontSize: '1rem', marginBottom: 2 }}><strong>Age:</strong> {listing.age}</div>
                                    <div style={{ color: '#444', fontSize: '1rem', marginBottom: 2 }}><strong>Gender:</strong> {listing.gender}</div>
                                    <div style={{ color: '#444', fontSize: '1rem', marginBottom: 2 }}><strong>Weight:</strong> {listing.weight}</div>
                                    <div style={{ color: '#444', fontSize: '1rem', marginBottom: 2 }}><strong>Color:</strong> {listing.color}</div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '0 18px', marginTop: '20px' }}>
                                    <button onClick={() => navigate(`/listings/${listing.id}/edit`)} style={{ flex: 1, padding: '8px 0', background: '#E0E7FF', color: '#000000', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: 12 }}>Edit</button>
                                    <button onClick={() => navigate(`/listings/${listing.id}`, { state: { from: 'my-listings' } })} style={{ flex: 1, padding: '8px 0', background: '#fff', color: '#7C3AED', border: '2px solid #7C3AED', borderRadius: 6, fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: 12 }}>View Details</button>
                                    <button onClick={async () => {
                                        if(window.confirm('Are you sure you want to delete this listing?')) {
                                            await axios.post(`${API_BASE_URL}/listings/${listing.id}/delete`, {}, { withCredentials: true });
                                            window.location.reload();
                                        }
                                    }} style={{ flex: 1, padding: '8px 0', background: '#ef6666', color: '#ffffff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: 12 }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyListings;
