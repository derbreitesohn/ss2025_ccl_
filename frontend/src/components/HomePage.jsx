import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { FaHeart } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:3000';

function HomePage() {
    const [listings, setListings] = useState([]);
    const [error, setError] = useState(null);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [animalTab, setAnimalTab] = useState('all');
    const animalCounts = {
        all: listings.length,
        dogs: listings.filter(l => (l.animal || '').toLowerCase() === 'dog').length,
        cats: listings.filter(l => (l.animal || '').toLowerCase() === 'cat').length,
        playdate: listings.filter(l => (l.listing_type || '').toLowerCase() === 'playdate').length,
        adoption: listings.filter(l => (l.listing_type || '').toLowerCase() === 'adoption').length,
    };
    const filteredListings = listings.filter(listing => {
        if (animalTab === 'all') return true;
        if (animalTab === 'dogs') return (listing.animal || '').toLowerCase() === 'dog';
        if (animalTab === 'cats') return (listing.animal || '').toLowerCase() === 'cat';
        if (animalTab === 'playdate') return (listing.listing_type || '').toLowerCase() === 'playdate';
        if (animalTab === 'adoption') return (listing.listing_type || '').toLowerCase() === 'adoption';
        return true;
    });

    useEffect(() => {
        axios.get(`${API_BASE_URL}/listings`)
            .then(response => {
                setListings(response.data.listings);
            })
            .catch(error => {
                console.error('Error fetching listings:', error);
                setError('Failed to load listings');
            });

        axios.get(`${API_BASE_URL}/favorites`, { withCredentials: true })
            .then(res => {
                setFavoriteIds(res.data.favorites.map(fav => fav.id));
            })
            .catch(() => {});

        axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    const toggleFavorite = async (listingId) => {
        if (favoriteIds.includes(listingId)) {
            await axios.delete(`${API_BASE_URL}/favorites/${listingId}`, { withCredentials: true });
            setFavoriteIds(favoriteIds.filter(id => id !== listingId));
        } else {
            await axios.post(`${API_BASE_URL}/favorites/${listingId}`, {}, { withCredentials: true });
            setFavoriteIds([...favoriteIds, listingId]);
        }
    };

    return (
        <div style={{ background: '#fff', minHeight: '100vh', color: 'black' }}>
            <Navbar />
            <div className="page-content" style={{ maxWidth: '1300px', margin: '0 auto', padding: '30px 20px' }}>
                <h1 style={{ fontWeight: 700, fontSize: '2.5rem', marginBottom: '20px', color: '#222' }}>Browse Current Listings</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    <button onClick={() => setAnimalTab('all')} style={{ background: animalTab === 'all' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'all' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>All ({animalCounts.all})</button>
                    <button onClick={() => setAnimalTab('dogs')} style={{ background: animalTab === 'dogs' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'dogs' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>Dogs ({animalCounts.dogs})</button>
                    <button onClick={() => setAnimalTab('cats')} style={{ background: animalTab === 'cats' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'cats' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>Cats ({animalCounts.cats})</button>
                    <button onClick={() => setAnimalTab('playdate')} style={{ background: animalTab === 'playdate' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'playdate' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>Playdate ({animalCounts.playdate})</button>
                    <button onClick={() => setAnimalTab('adoption')} style={{ background: animalTab === 'adoption' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'adoption' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>Adoption ({animalCounts.adoption})</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginTop: '30px' }}>
                    {filteredListings.map(listing => (
                        <div
                            key={listing.id}
                            style={{
                                background: '#fff',
                                border: '1.5px solid #e5e5e5',
                                borderRadius: '12px',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                padding: '0 0 18px 0',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                position: 'relative',
                                minHeight: '320px',
                                color: 'black',
                                overflow: 'hidden',
                            }}
                        >

                            <div style={{ position: 'absolute', top: 18, right: 18, zIndex: 10 }}>
                                <FaHeart
                                    onClick={e => { e.stopPropagation(); toggleFavorite(listing.id); }}
                                    style={{
                                        fontSize: 28,
                                        color: favoriteIds.includes(listing.id) ? '#E11D48' : '#e5e5e5',
                                        cursor: 'pointer',
                                        transition: 'color 0.2s',
                                        filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.10))'
                                    }}
                                    title={favoriteIds.includes(listing.id) ? 'Remove from favorites' : 'Add to favorites'}
                                />
                            </div>
                            {listing.photo_url && (
                                <img
                                    src={listing.photo_url}
                                    alt={listing.pet_name}
                                    style={{
                                        width: '100%',
                                        height: '140px',
                                        objectFit: 'cover',
                                        borderTopLeftRadius: '12px',
                                        borderTopRightRadius: '12px',
                                        marginBottom: '10px'
                                    }}
                                />
                            )}
                            <div style={{ padding: '0 20px', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                        {/* Badge */}
                                        <span style={{ position: 'absolute', top: 12, left: 12, background: '#fff', color: '#7C3AED', border: '2px solid #7C3AED', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', padding: '3px 12px', zIndex: 2 }}>{listing.listing_type ? listing.listing_type.charAt(0).toUpperCase() + listing.listing_type.slice(1) : ''}</span>
                                    <span style={{ color: '#888', fontSize: '0.95rem' }}>{listing.location}</span>
                                </div>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 6px 0', color: '#222' }}>{listing.pet_name}</h2>
                                <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: '4px' }}><strong>Breed:</strong> {listing.breed}</div>
                                <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: '4px' }}><strong>Age:</strong> {listing.age}</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '0 20px' }}>
                                <button
                                    onClick={() => navigate(`/messages?user=${listing.user_id}`)}
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
                                    onClick={() => navigate(`/listings/${listing.id}`, { state: { from: 'home' } })}
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
