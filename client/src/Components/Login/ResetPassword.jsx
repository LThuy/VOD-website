import React, { useState } from 'react';
import { Link, useNavigate, useParams  } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../Style/BodyCss/Login.css';
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { token } = useParams();

  const validateInput = () => {
    if (!password.trim() || !confirmPassword.trim()) {
      toast.error('All fields are required.');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_BASE_URL}/reset-password`,
        { password, resetToken: token }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while resetting the password.');
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
          <h2>ENTER YOUR NEW PASSWORD</h2>
        </div>
        <div className="form-section">
          <form className="form-section-container" onSubmit={handleSubmit}>
            <div className="form-section_input">
              <input
                className="formlogin-inputvalue"
                type="password"
                name="password"
                placeholder="New Password"
                value={password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-section_input mt-3">
              <input
                className="formlogin-inputvalue"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-seciton_btn mt-3">
              <button
                className="login-btn"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Reset Password'}
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
          {[
            {
              url: 'https://image.benq.com/is/image/benqco/cinehome-w1800i-immerse-yourself-%20in-4K?$ResponsivePreset$',
              alt: '4K Movie Experience',
            },
            {
              url: 'https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/24090985/jbareham_210927_ecl1085_grids_6up_master.jpg?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=2400',
              alt: 'Cinema Grid',
            },
            {
              url: 'https://images2.alphacoders.com/689/689327.jpg',
              alt: 'Movie Scene',
            },
          ].map((slide, index) => (
            <div
              key={index}
              className="slide"
              style={{ backgroundImage: `url(${slide.url})` }}
              aria-label={slide.alt}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
