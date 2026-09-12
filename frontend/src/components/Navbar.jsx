import { useState } from 'react';
import { useNavigate, Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../auth';
import { loginPath } from '../api';
import './Navbar.css';
import logo from '../images/logo_patpat.png';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const current = location.pathname + location.search + location.hash;

    const handleLogout = async () => {
        setBusy(true);
        setError('');
        try {
            await logout();
            navigate('/');
        } catch {
            setError('Couldn’t log out. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    return <header className="navbar">
        <nav className="nav-inner" aria-label="Main navigation">
            <Link to="/" className="logo-container" aria-label="PatPat home"><img src={logo} alt="PatPat" className="logo" /></Link>
            <div id="main-menu" className={`nav-links ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}>
                <NavLink to="/" end>Home</NavLink>
                {user ? <>
                    <NavLink to="/profile">Profile</NavLink>
                    <NavLink to="/listings">My Listings</NavLink>
                    <NavLink to="/favorites">Favorites</NavLink>
                    <NavLink to="/messages">Messages</NavLink>
                </> : <>
                    <Link to="/#browse">Find a companion</Link>
                    <Link to="/#how-it-works">How it works</Link>
                </>}
            </div>
            <div className="nav-actions">
                {user ? <button className="pat-button secondary" onClick={handleLogout} disabled={busy}>{busy ? 'Logging out…' : 'Log out'}</button> :
                    <Link className="pat-button" to={loginPath(current)}>Log in <span aria-hidden="true">↗</span></Link>}
                <button className="mobile-menu-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen(!open)}>{open ? <FiX /> : <FiMenu />}</button>
            </div>
        </nav>
        {error && <div className="nav-error" role="alert">{error}</div>}
    </header>;
}
