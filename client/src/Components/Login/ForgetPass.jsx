import React, { useState } from 'react';
import '../../Style/BodyCss/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function ForgetPass() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate email
  const validateInput = () => {
    if (!email.trim()) {
      toast.error('Email is required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format.');
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }
    setIsSubmitting(true);

    try {
      // Send a POST request to the server
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        navigate('/login'); // Navigate back to login after success
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('An error occurred while sending the password reset email.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-login-container">
        <div className="form-login-header">
          <h3>TTFILM</h3>
          <p>LET YOUR HAIR DOWN</p>
          <h2>ENTER YOUR EMAIL</h2>
          <h2>TO RESET</h2>
        </div>
        <div className="form-seciton">
          <form className="form-seciton-container" onSubmit={handleSubmit}>
            <div className="form-section_input">
              <input
                className="formlogin-inputvalue"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-seciton_btn mt-3">
              <button
                className="login-btn"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
            <div className="form-section_register mt-3">
              <span>Remembered your password?</span>
              <Link to={'/login'} className="register-btn">
                Log In
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="carousel">
        <div className="slides">
          <div
            className="slide"
            style={{
              background: 'url(https://image.benq.com/is/image/benqco/cinehome-w1800i-immerse-yourself-%20in-4K?$ResponsivePreset$)',
            }}
          ></div>
          <div
            className="slide"
            style={{
              background: 'url(https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/24090985/jbareham_210927_ecl1085_grids_6up_master.jpg?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=2400)',
            }}
          ></div>
          <div
            className="slide"
            style={{
              background: 'url(https://images2.alphacoders.com/689/689327.jpg)',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPass;
