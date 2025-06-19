import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import axios from 'axios'

import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import Profile from './components/Profile'
import MyListings from './components/MyListings'
import Favorites from './components/Favorites'
import Messages from './components/Messages'
import SignUp from './components/SignUp'
import AddPet from './components/AddPet'
import AddListing from './components/AddListing'
import ListingDetail from './components/ListingDetail'
import PetDetail from './components/PetDetail'
import EditPet from './components/EditPet'
import EditListing from './components/EditListing'

function App() {
    const [count, setCount] = useState(0)

    const fetchAPI = async () => {
        try {
            const response = await axios.get("https://cc241045-10757.node.fhstp.cc/");
            console.log(response);
        } catch (error) {
            console.error("API Error:", error);
            console.error("Error response:", error.response?.data);
        }
    }

    useEffect(() => {
        fetchAPI();
    },[])

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/listings" element={<MyListings />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/add-pet" element={<AddPet />} />
                    <Route path="/add-listing" element={<AddListing />} />
                    <Route path="/listings/:id" element={<ListingDetail />} />
                    <Route path="/pets/:id" element={<PetDetail />} />
                    <Route path="/edit-pet/:id" element={<EditPet />} />
                    <Route path="/listings/:id/edit" element={<EditListing />} />
                </Routes>
            </Router>
        </>
    )
}

export default App
