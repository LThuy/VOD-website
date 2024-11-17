import React, { useState } from 'react';
import '../../Style/BodyCss/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login({ setUserEmail }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Custom validator
  const validateInput = () => {
    const { email, password } = formData;

    if (!email.trim()) {
      toast.error('Email is required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format.');
      return false;
    }

    if (!password.trim()) {
      toast.error('Password is required.');
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // formData contains user email and password
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Login failed");
      }

      const result = await response.json();

      // Show success toast
      toast.success(result.message || 'Login successful!');

      // Save token and email to localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('userEmail', result.email); // Save user's email

      // Optionally update the app state with the user's email
      if (typeof setUserEmail === 'function') {
        setUserEmail(result.email);
      }

      // Navigate to the home page after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred during login.');
    }
  };


  return (
    <div className="login-container">
      <div className="form-login-container">
        <div className="form-login-header">
          <h3>TTFILM</h3>
          <p>LET YOUR HAIR DOWN</p>
          <h2>LOGIN</h2>
        </div>
        <div className="form-seciton">
          <form className="form-seciton-container" onSubmit={handleSubmit}>
            <div className="form-seciton_input">
              <input
                className="formlogin-inputvalue"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-seciton_input mt-3">
              <input
                className="formlogin-inputvalue"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-seciton_btn mt-3">
              <button className="login-btn" type="submit">
                Đăng nhập
              </button>
            </div>
            <div className="form-section_register mt-3">
              <span>Bạn chưa có tài khoản?</span>
              <Link to={'/register'} className="register-btn">
                Đăng ký
              </Link>
            </div>
            <div className="form-section_register mt-2">
              <Link to={'/forget'} className="register-btn">
                Bạn quên mật khẩu?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
