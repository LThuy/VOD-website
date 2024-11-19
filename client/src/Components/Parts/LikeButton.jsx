import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const LikeButton = ({ filmData, userId, showToast }) => {
  const [isActive, setIsActive] = useState(false);

  const handleLikeClick = async () => {
    setIsActive(!isActive); // Toggle button active state


    try {
      const response = await fetch("http://localhost:5000/film/add-favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId, // Send user ID
          filmData: filmData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Call the showToast function with a success message
        showToast("success", result.message || "Film added to favorites!");
      } else {
        throw new Error(result.message || "Error liking the film");
      }
    } catch (error) {
      // Call the showToast function with an error message
      showToast("error", error.message || "Failed to like the film.");
    }
  };

  return (
    <div className="like-btn-container">
      <button onClick={handleLikeClick} className={isActive ? "active" : ""}>
        <FontAwesomeIcon icon={faHeart} />
        {isActive ? " Đã thích" : " Thích"}
      </button>
    </div>
  );
};

export default LikeButton;
