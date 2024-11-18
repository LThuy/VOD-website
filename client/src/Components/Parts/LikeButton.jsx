import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const LikeButton = ({ filmId, userId }) => {
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
          filmId: filmId, // Send the film ID
          likeStatus: !isActive, // Send like status (true or false)
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Film like status updated successfully:", result);
      } else {
        throw new Error(result.message || "Error liking the film");
      }
    } catch (error) {
      console.error("Error during like action:", error);
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
