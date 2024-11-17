import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        const verifyToken = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/verify-email?token=${token}`);
                const message = response.data.message;
                navigate('/successnotice', { state: { message } });
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Invalid or expired token!';
                navigate('/error', { state: { message: errorMessage } });
            }
        };

        if (token) {
            verifyToken();
        }
    }, [location, navigate]);

    return <div>Verifying your email...</div>;
};

export default VerifyEmail;
