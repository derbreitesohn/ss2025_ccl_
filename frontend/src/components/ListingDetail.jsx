import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:3000';

function ListingDetail() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/listings/${id}`)
            .then(response => {
                setListing(response.data.listing);
            })
            .catch(error => {
                setError('Failed to load listing details');
            })
            .finally(() => setLoading(false));
        axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, [id]);

    // Determine navigation context
    const fromMyListings = location.state && location.state.from === 'my-listings';
    const fromHome = location.state && location.state.from === 'home';

    if (loading) return <div><Navbar /><p>Loading...</p></div>;
    if (error) return <div><Navbar /><p style={{color: 'red'}}>{error}</p></div>;
    if (!listing) return <div><Navbar /><p>No listing found.</p></div>;

    return (
        <div>
            <Navbar />
            <div className="breadcrumb">
                <a href="/">Home</a>
                <span>&gt;</span>
                {fromMyListings ? (
                    <>
                        <a href="/listings">My Listings</a>
                        <span>&gt;</span>
                        <span>Listing Details</span>
                    </>
                ) : (
                    <span>Listing Details</span>
                )}
            </div>
            <div className="detail-card" style={{position: 'relative'}}>
                {listing.photo_url && (
                    <div style={{ position: 'relative' }}>
                        <img src={listing.photo_url} alt={listing.pet_name} />
                        {/* Type badge on photo */}
                        <span className="listing-badge" style={{ top: 18, right: 18, left: 'unset', bottom: 'unset' }}>{listing.listing_type ? listing.listing_type.charAt(0).toUpperCase() + listing.listing_type.slice(1) : ''}</span>
                        {/* Location under photo, right-aligned */}
                        <div style={{ textAlign: 'right', color: '#888', fontWeight: 500, marginTop: 8, marginBottom: 8, fontSize: '1.08rem' }}>{listing.location}</div>
                    </div>
                )}
                <h1 className={'h1-centered'}>{listing.pet_name}</h1>
                <div className="detail-box-grid">
                    <div className="detail-box"><div className="detail-box-label">Age</div><div className="detail-box-value">{listing.age}</div></div>
                    <div className="detail-box"><div className="detail-box-label">Gender</div><div className="detail-box-value">{listing.gender}</div></div>
                    <div className="detail-box"><div className="detail-box-label">Weight</div><div className="detail-box-value">{listing.weight}</div></div>
                    <div className="detail-box"><div className="detail-box-label">Color</div><div className="detail-box-value">{listing.color}</div></div>
                    <div className="detail-box"><div className="detail-box-label">Breed</div><div className="detail-box-value">{listing.breed}</div></div>
                    <div className="detail-box"><div className="detail-box-label">Animal</div><div className="detail-box-value">{listing.animal}</div></div>
                </div>
                <div style={{margin: '32px 0 18px 0', textAlign: 'left'}}>
                    <div className="detail-info-list-item"><span className="detail-info-label">About:</span> {listing.about}</div>
                </div>
                {/* Contact button if from home and user is the owner */}
                {fromHome && user && user.id === listing.user_id && (
                    <button
                        onClick={() => navigate(`/messages?user=${listing.user_id}`)}
                        style={{
                            padding: '12px 0',
                            background: '#7C3AED',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            marginTop: '32px',
                            width: '100%'
                        }}
                    >
                        Contact
                    </button>
                )}
            </div>
        </div>
    );
}

export default ListingDetail;