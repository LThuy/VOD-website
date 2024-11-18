import React, { useState, useEffect } from "react";
import "../../Style/BodyCss/Profile.css";
import { Link } from "react-router-dom";

const Profile = () => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  return (
    <div className="profiledetail-section">
      <div className="profiledetail-container">
        <div className="profiledetail-container-grid">
          <div className="profiledetail-container-item">
            <div className="profiledetail-container-item_header">
              <h1>Profile</h1>
            </div>
            <div className="profiledetail-container-item-info">
              <div className="profiledetail-container-item-info-text">
                <h4>
                  TTFilm - WHERE IS PLACE CAN LET YOUR HAIR DOWN
                </h4>
                <h4>
                  Your Email: <span>{userEmail}</span>
                </h4>
                <h4>
                  Password: <span>******</span>
                </h4>
                <div className="profile-changepass-container mt-4">
                  <Link to={'/changepassword'} className="changepass-link">
                    Change Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
