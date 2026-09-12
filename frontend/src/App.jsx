import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import Profile from './components/Profile';
import MyListings from './components/MyListings';
import Favorites from './components/Favorites';
import Messages from './components/Messages';
import SignUp from './components/SignUp';
import AddPet from './components/AddPet';
import AddListing from './components/AddListing';
import ListingDetail from './components/ListingDetail';
import PetDetail from './components/PetDetail';
import EditPet from './components/EditPet';
import EditListing from './components/EditListing';
import AuthProvider from './components/AuthProvider';
import RequireAuth from './components/RequireAuth';
import Navbar from './components/Navbar';

function RoutePosition() {
    const { pathname, hash } = useLocation();
    const previousPath = useRef(null);
    useEffect(() => {
        const changedPage = previousPath.current !== pathname;
        previousPath.current = pathname;
        if (hash) {
            requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
        } else if (changedPage) {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);
    return null;
}

export default function App() {
    return <BrowserRouter><AuthProvider><RoutePosition /><Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route element={<RequireAuth />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/listings" element={<MyListings />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/add-pet" element={<AddPet />} />
            <Route path="/add-listing" element={<AddListing />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="/edit-pet/:id" element={<EditPet />} />
            <Route path="/listings/:id/edit" element={<EditListing />} />
        </Route>
        <Route path="*" element={<><Navbar /><main className="page-shell"><div className="state-panel"><h1>This page wandered off.</h1><p>Let’s get you back to the pets.</p><Link className="pat-button" to="/">Back to home</Link></div></main></>} />
    </Routes></AuthProvider></BrowserRouter>;
}
