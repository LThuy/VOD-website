import React, { useState } from 'react';
import '../../Style/BodyCss/Login.css';
import { Link, useNavigate ,useLocation } from 'react-router-dom';
import axios from 'axios';

function NoticeVerify() {
  const location = useLocation();
  const email = location.state?.email;
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // To show a loading state

  const handleResendEmail = async () => {
    setIsLoading(true); // Show loading indicator
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/resend-verification', {
        email: email, // Update this to the correct user email
      });
      setMessage(response.data.message || 'Verification email resent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend the verification email.');
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="login-container">
      <div className="form-login-container">
        <div className="form-login-header">
          <h3>TTFILM</h3>
          <p>LET YOUR HAIR DOWN</p>
          <h2>Verify Your Account</h2>
        </div>

        <div className="form-section">
          <p className="verification-message">
            We've sent a verification email to your registered email address. 
            Please check your inbox (and spam folder) and follow the instructions 
            to verify your account.
          </p>
          <p>
            If you didn't receive the email,{' '}
            <button
              className="resent-btn"
              onClick={handleResendEmail}
              disabled={isLoading} // Disable button while loading
              style={{
                border: 'none',
                background: 'none',
                color: 'blue',
                textDecoration: 'underline',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Resending...' : 'click here'}
            </button>{' '}
            to resend it.
          </p>
          {/* Show success or error message */}
          {message && <p className="success-message" style={{ color: 'green' }}>{message}</p>}
          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        </div>

        <div className="tologin-container">
          <Link to="/login" className="tologin-btn">ĐI ĐẾN TRANG ĐĂNG NHẬP</Link>
        </div>
      </div>
    </div>
  );
}

export default NoticeVerify;
