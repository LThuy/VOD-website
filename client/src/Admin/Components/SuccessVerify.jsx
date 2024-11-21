import React, { useState } from 'react';
import '../../Style/BodyCss/Login.css';
import { Link, useNavigate ,useLocation } from 'react-router-dom';
import axios from 'axios';

function SuccesNotice() {
  const location = useLocation();
    const message = location.state?.message || 'Email verification successful!';


  return (
    <div className="login-container">
      <div className="form-login-container">
        <div className="form-login-header">
          <h3>THFILM</h3>
          <p>LET YOUR HAIR DOWN</p>
          <h2>Verify Your Account Successfully</h2>
        </div>

        <div className="form-section">
          <div class="alert alert-success success-notice" role="alert">
            {message}
          </div>
        </div>

        <div className="tologin-container">
          <Link to="/admin/login" className="tologin-btn">ĐI ĐẾN TRANG ĐĂNG NHẬP</Link>
        </div>
      </div>
    </div>
  );
}

export default SuccesNotice;
