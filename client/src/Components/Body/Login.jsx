import React, { useState } from 'react';
import '../../Style/BodyCss/Login.css'
import { Link,useNavigate } from 'react-router-dom';


function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if(response.status === 400) {
        setErrorMessage(response.message)
      }
  
      const result = await response.json(); 
      console.log(result); 
  
      alert(result.message); 
      localStorage.setItem('token', result.token); 
      setTimeout(() => {
        navigate('/')
      }, 2000);
    } catch (error) {
      if (error.response) {
        console.log('Error response:', error.response);
        
        if (error.response.status === 400) {
          setErrorMessage(error.response.data.message || "Invalid request. Please check your input.");
        } 
        else if (error.response.status === 401) {
          setErrorMessage(error.response.data.message || "Invalid username or password.");
        }
        else {
          setErrorMessage(error.response.data.message || "An error occurred during login.");
        }
      } else if (error.request) {
        console.log('Error request:', error.request);
        setErrorMessage("No response from server. Please try again.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
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
            <div className="form-seciton_btn mt-3">
              <button className="login-btn" type="submit">
                Đăng nhập
              </button>
            </div>
            <div className="form-section_register mt-3">
                <span>
                    Bạn chưa có tài khoản?  
                </span>
                <Link to={'/register'} className='register-btn' >
                    Đăng ký
                </Link>
            </div>
            <div className="form-section_register mt-2">
                <Link to={'/forgetz'} className='register-btn' >
                    Bạn quên mật khẩu?
                </Link>
            </div>
            {errorMessage && (
              <div className="alert alert-danger alert-message mt-3">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;