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

function App() {
    const [count, setCount] = useState(0)

    const fetchAPI = async () => {
        try {
            const response = await axios.get("http://localhost:3000/");
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
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/mylistings" element={<MyListings />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/add-pet" element={<AddPet />} />
                </Routes>
            </Router>
        </>
    )
}

export default App
