import React, { useState, useEffect } from "react";
import "../../Style/BodyCss/Profile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ChangePassword() {
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    } else {
      toast.error("User not logged in.");
      navigate("/login");
    }
  }, [navigate]);
  useEffect(() => {
    document.title = "Change Your Password"
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword) {
      toast.error("Old password is required.");
      return false;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/change-password`, {
        email: userEmail,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      toast.success(response.data.message || "Password changed successfully!");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to change password.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="profiledetail-section">
      <div className="profiledetail-container">
        <div className="profiledetail-container-grid">
          <div className="profiledetail-container-item">
            <div className="profiledetail-container-item_header">
              <h1>Change Your Password</h1>
            </div>
            <div className="profiledetail-container-item-info">
              <div className="profiledetail-container-item-info-text">
                <form id="changepasswordForm" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <span>Email:</span>
                    <input name="email" disabled className="form-input-email" type="text" value={userEmail} />
                  </div>
                  <div className="form-group">
                    <span>Enter Old Password:</span>
                    <input name="oldPassword" className="form-input" type="password" onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <span>Enter New Password:</span>
                    <input name="newPassword" className="form-input" type="password" onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <span>Confirm New Password:</span>
                    <input name="confirmPassword" className="form-input" type="password" onChange={handleChange} />
                  </div>
                  <div className="form-group-btn">
                    <button type="submit" className="form-submit-btn">Change Password</button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
