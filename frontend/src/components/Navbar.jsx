import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../images/logo_patpat.png';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar" style={{ background: '#fff', color: 'black' }}>
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" style={{ height: '40px', width: 'auto' }} />
            </div>

            <button
                className="mobile-menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                ☰
            </button>

            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <div className="nav-links-left">
                    <Link to="/">Home</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/listings">My Listings</Link>
                    <Link to="/favorites">Favorites</Link>
                    <Link to="/messages">Messages</Link>
                </div>
            </div>

            <div className="nav-links-right">
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
