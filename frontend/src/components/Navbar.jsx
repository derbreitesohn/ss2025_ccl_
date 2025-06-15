import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../images/logo_patpat.png';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [atTop, setAtTop] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setAtTop(window.scrollY === 0);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className={`navbar${atTop ? ' at-top' : ''}`} style={{ background: '#fff', color: 'black' }}>
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" style={{ height: '60px', width: 'auto' }} />
            </div>

            <button
                className="mobile-menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                ☰
            </button>

            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <div className="nav-links-left">
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                    <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
                    <Link to="/listings" className={location.pathname === '/listings' ? 'active' : ''}>My Listings</Link>
                    <Link to="/favorites" className={location.pathname === '/favorites' ? 'active' : ''}>Favorites</Link>
                    <Link to="/messages" className={location.pathname === '/messages' ? 'active' : ''}>Messages</Link>
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
