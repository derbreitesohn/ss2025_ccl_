import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


const API_BASE_URL = 'http://localhost:3000';


function myListings() {
    return (
        <div>
            <h1>Welcome to the Listings Page!</h1>
        </div>

    );
}

export default myListings;