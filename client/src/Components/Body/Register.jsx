import React, { useEffect, useState } from 'react';
import '../../Style/BodyCss/Login.css'
import { Link, useNavigate} from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMMessage] = useState("");
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMMessage(result.message)
        setTimeout(() => {
          navigate('/login')
        },2000)
      } else {
        console.error('Error:', result);
        setErrorMessage(result.message); 
      }
    } catch (error) {
      console.error('Client-side error:', error);
      setErrorMessage('An error occurred during registration.');
    }
  };


  return (
    <div className="login-container">
      <div className="form-login-container">
        <div className="form-login-header">
          <h3>TTFILM</h3>
          <p>LET YOUR HAIR DOWN</p>
          <h2>REGISTER</h2>
        </div>
        <div className="form-seciton">
          <form id='registerForm' className="form-seciton-container" onSubmit={handleSubmit}>
            <div className="form-seciton_input">
              <input
                className="formlogin-inputvalue"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
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
            <div className="form-seciton_input mt-3">
              <input
                className="formlogin-inputvalue"
                type="password"
                name="confirmPassword"
                placeholder="Comform Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-seciton_btn mt-3">
              <button className="login-btn" type="submit">
                Đăng ký
              </button>
            </div>
            <div className="form-section_register mt-3">
                <span>
                    Bạn đã có tài khoản?  
                </span>
                <Link to={'/login'} className='register-btn'>
                    Đăng nhập
                </Link>
            </div>
            {errorMessage && (
              <div className="alert alert-danger alert-message mt-3">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="alert alert-success alert-message mt-3">
                {successMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register