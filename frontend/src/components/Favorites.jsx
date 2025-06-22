import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import Navbar from "./Navbar.jsx";
import { FaHeart } from 'react-icons/fa';

const API_BASE_URL = 'https://cc241045-10757.node.fhstp.cc/api';

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [animalTab, setAnimalTab] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/favorites`, { withCredentials: true })
            .then(res => setFavorites(res.data.favorites))
            .catch(() => setFavorites([]));
    }, []);

    const removeFavorite = async (listingId) => {
        try {
            await axios.delete(`${API_BASE_URL}/favorites/${listingId}`, { withCredentials: true });
            setFavorites(favorites.filter(fav => fav.id !== listingId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    const animalCounts = {
        all: favorites.length,
        dogs: favorites.filter(f => (f.animal || '').trim().toLowerCase() === 'dog').length,
        cats: favorites.filter(f => (f.animal || '').trim().toLowerCase() === 'cat').length,
        playdate: favorites.filter(f => (f.listing_type || '').trim().toLowerCase() === 'playdate').length,
        adoption: favorites.filter(f => (f.listing_type || '').trim().toLowerCase() === 'adoption').length,
    };

    const filteredFavorites = favorites.filter(favorite => {
        if (animalTab === 'all') return true;
        if (animalTab === 'dogs') return (favorite.animal || '').trim().toLowerCase() === 'dog';
        if (animalTab === 'cats') return (favorite.animal || '').trim().toLowerCase() === 'cat';
        if (animalTab === 'playdate') return (favorite.listing_type || '').trim().toLowerCase() === 'playdate';
        if (animalTab === 'adoption') return (favorite.listing_type || '').trim().toLowerCase() === 'adoption';
        return true;
    });

    return (
        <div style={{ background: '#fff', minHeight: '100vh', color: 'black' }}>
            <Navbar />
            <div className="page-content" style={{ maxWidth: '1300px', margin: '0 auto', padding: '30px 20px' }}>
                <h1 style={{ fontWeight: 700, fontSize: '2.5rem', marginBottom: '10px', color: '#222' }}>My Favorites</h1>
                {favorites.length === 0 ? (
                    <p style={{ color: '#888', fontSize: '1.2rem' }}>You haven't favorited any listings yet.</p>
                ) : (
                    <>
                        <div className="mylistings-filters" style={{ marginBottom: 30 }}>
                            <button onClick={() => setAnimalTab('all')} style={{ background: animalTab === 'all' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'all' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer', marginRight: '8px' }}>All ({animalCounts.all})</button>
                            <button onClick={() => setAnimalTab('dogs')} style={{ background: animalTab === 'dogs' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'dogs' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer', marginRight: '8px' }}>Dogs ({animalCounts.dogs})</button>
                            <button onClick={() => setAnimalTab('cats')} style={{ background: animalTab === 'cats' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'cats' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer', marginRight: '8px' }}>Cats ({animalCounts.cats})</button>
                            <button onClick={() => setAnimalTab('playdate')} style={{ background: animalTab === 'playdate' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'playdate' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer', marginRight: '8px' }}>Playdate ({animalCounts.playdate})</button>
                            <button onClick={() => setAnimalTab('adoption')} style={{ background: animalTab === 'adoption' ? '#7C3AED' : '#f3f3f3', color: animalTab === 'adoption' ? '#fff' : '#444', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: '1rem', padding: '6px 18px', cursor: 'pointer' }}>Adoption ({animalCounts.adoption})</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginTop: '30px' }}>
                            {filteredFavorites.map(listing => (
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
                                        minHeight: '420px',
                                        color: 'black'
                                    }}
                                >
                                    {/* Heart Icon */}
                                    <FaHeart
                                        onClick={() => removeFavorite(listing.id)}
                                        style={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            fontSize: 28,
                                            color: '#E11D48',
                                            cursor: 'pointer',
                                            zIndex: 2,
                                            transition: 'color 0.2s'
                                        }}
                                        title={'Remove from favorites'}
                                    />
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
                    </>
                )}
            </div>
        </div>
    );
}

export default Favorites;