import React, { useEffect, useState } from "react";
import "../../Style/BodyCss/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login({ setUserEmail }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [userId, setUserId] = useState()

  // Track user online time
  useEffect(() => {
    document.title = "Login Page";
    
  }, []);

  // Validate inputs
  const validateInput = () => {
    const { email, password } = formData;

    if (!email.trim()) {
      toast.error("Email is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      return false;
    }

    if (!password.trim()) {
      toast.error("Password is required.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
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
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Login failed");
      }

      const result = await response.json();

      toast.success(result.message || "Login successful!");

      // Save user data to localStorage
      localStorage.setItem("token", result.token);
      localStorage.setItem("userEmail", result.email);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("userRole", result.role);
      setUserId(result.userId);

      if (typeof setUserEmail === "function") {
        setUserEmail(result.email);
      }

      // Navigate after successful login
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred during login.");
    }
  };

  const handleGuestAccess = () => {
    sessionStorage.setItem("isGuest", "true"); // Set guest status in sessionStorage
  };

  return (
    <div className="login-container">
      <div className="form-login-container">
        <div className="form-login-header">
          <h3>TTFILM</h3>
          <p>LET YOUR HAIR DOWN</p>
          <h2>LOGIN</h2>
        </div>
        <div className="form-section">
          <form className="form-section-container" onSubmit={handleSubmit}>
            <div className="form-section_input">
              <input
                className="formlogin-inputvalue"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-section_input mt-3">
              <input
                className="formlogin-inputvalue"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-section_input mt-3">
              <button className="login-btn" type="submit">
                Đăng nhập
              </button>
            </div>
            <div className="form-section_register mt-3">
              <span>Bạn chưa có tài khoản?</span>
              <Link to={"/register"} className="register-btn">
                Đăng ký
              </Link>
            </div>
            <div className="form-section_register mt-2">
              <Link to={"/forgetpassword"} className="register-btn">
                Bạn quên mật khẩu?
              </Link>
            </div>
            <div className="form-section_register w-full mt-4">
              <Link to={"/"} className="guess-btn" onClick={handleGuestAccess}>
                Tiếp tục với tư cách Khách
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="carousel">
        <div className="slides">
          {[
            "https://image.benq.com/is/image/benqco/cinehome-w1800i-immerse-yourself-%20in-4K?$ResponsivePreset$",
            "https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/24090985/jbareham_210927_ecl1085_grids_6up_master.jpg?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=2400",
            "https://images2.alphacoders.com/689/689327.jpg",
          ].map((url, index) => (
            <div key={index} className="slide" style={{ background: `url(${url})` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Login;
