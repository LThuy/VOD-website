import React,{ useState ,useEffect}  from "react";
import "../../Style/BodyCss/Profile.css";

const Profile = () => {
  // Generate a random ID
  const randomId = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
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
              <h1>User's Information</h1>
            </div>
            <div className="profiledetail-container-item-info">
              <div className="profiledetail-container-item-info-text">
                <h4>
                  ID: <span>{randomId}</span>
                </h4>
                <h4>
                  Your Email: <span>{userEmail}</span>
                </h4>
                <h4>
                  Password: <span>******</span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
