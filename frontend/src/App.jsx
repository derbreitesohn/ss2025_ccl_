import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import axios from 'axios'



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


            </Routes>
        </Router>
    </>
  )
}

export default App
