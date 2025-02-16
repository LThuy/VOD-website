import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ChangePasswordModal from "../Parts/ChangePasswordModal";

// Function to check if the token is expired
function isTokenExpired(token) {
    try {
        const decoded = jwtDecode(token); // Decode the JWT token
        const currentTime = Date.now() / 1000; // Get current time in seconds
        return decoded.exp < currentTime; // If the 'exp' value is less than current time, it's expired
    } catch (error) {
        console.error("Invalid token:", error);
        return true; // If decoding fails, treat it as expired
    }
}

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const [mustChangePassword, setMustChangePassword] = useState(
        localStorage.getItem("mustChangePassword") === "true"
      );
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
    // Optional: Listen for changes (e.g., user updates password)
    const handleStorageChange = () => {
        setMustChangePassword(localStorage.getItem("mustChangePassword") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        const storedValue = localStorage.getItem("mustChangePassword");
        if (storedValue && mustChangePassword === true) {
          setShowModal(true); // Ensure modal state updates
        }
      }, []);

    const isGuest = sessionStorage.getItem('isGuest')
    console.log(!isGuest)
    
    if (!isGuest && (!token || isTokenExpired(token))) {
        // Remove invalid or expired token from localStorage and redirect to login page
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
    console.log("Retrieved mustChangePassword:", mustChangePassword);

    return <> 
                {showModal && <ChangePasswordModal />}
                {children} 
            </>; 
};

export default ProtectedRoute;
