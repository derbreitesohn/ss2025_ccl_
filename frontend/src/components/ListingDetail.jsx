import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:3000';

function ListingDetail() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/listings/${id}`)
            .then(response => {
                setListing(response.data.listing);
            })
            .catch(error => {
                setError('Failed to load listing details');
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div><Navbar /><p>Loading...</p></div>;
    if (error) return <div><Navbar /><p style={{color: 'red'}}>{error}</p></div>;
    if (!listing) return <div><Navbar /><p>No listing found.</p></div>;

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: '700px', margin: '40px auto', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '32px' }}>
                {listing.photo_url && (
                    <img src={listing.photo_url} alt={listing.pet_name} style={{ width: '100%', borderRadius: '12px', marginBottom: '24px' }} />
                )}
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{listing.pet_name}</h1>
                <p><strong>Type:</strong> {listing.listing_type}</p>
                <p><strong>Breed:</strong> {listing.breed}</p>
                <p><strong>Age:</strong> {listing.age}</p>
                <p><strong>Gender:</strong> {listing.gender}</p>
                <p><strong>Weight:</strong> {listing.weight}</p>
                <p><strong>Color:</strong> {listing.color}</p>
                <p><strong>Location:</strong> {listing.location}</p>
                <p><strong>About:</strong> {listing.about}</p>
            </div>
        </div>
    );
}

export default ListingDetail;