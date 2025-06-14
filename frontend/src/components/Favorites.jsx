import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import Navbar from "./Navbar.jsx";


const API_BASE_URL = 'http://localhost:3000';


function Favorites() {
    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Fav page</h1>
            </div>
        </div>
    );
}

export default Favorites;