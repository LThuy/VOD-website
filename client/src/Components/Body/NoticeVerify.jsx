import React, { useState } from 'react';
import '../../Style/BodyCss/Login.css'
import { Link,useNavigate } from 'react-router-dom';


function NoticeVerify() {
  const navigate = useNavigate()

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
          <p>If you didn't receive the email, <a href="#">click here</a> to resend it.</p>
        </div>
      </div>
    </div>
  );
  
}

export default NoticeVerify;