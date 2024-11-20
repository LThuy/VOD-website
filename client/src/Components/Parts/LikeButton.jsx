import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const LikeButton = ({ filmData, userId, showToast }) => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate()

  // Check if the film is already liked on component mount
  useEffect(() => {
    if (!userId) return; // Skip if the user is not logged in

    const checkFilmLiked = async () => {
      try {
        const response = await fetch(`http://localhost:5000/film/is-favorite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            filmId: filmData._id,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setIsActive(result.isFavorite); // Set active state based on response
        } else {
          throw new Error(result.message || "Error checking if the film is liked.");
        }
      } catch (error) {
        console.error("Error checking if the film is liked:", error);
      }
    };

    checkFilmLiked();
  }, [userId, filmData]);

  const handleLikeClick = async () => {
    if (!userId) {
      // Redirect to login if user is not logged in
      navigate("/login");
      return;
    }

    try {
      const url = isActive
        ? "http://localhost:5000/film/remove-favorite"
        : "http://localhost:5000/film/add-favorite";

      const body = isActive
        ? JSON.stringify({ userId: userId, filmId: filmData._id })
        : JSON.stringify({ userId: userId, filmData: filmData });

      const response = await fetch(url, {
        method: isActive ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      const result = await response.json();

      if (response.ok) {
        setIsActive(!isActive); // Toggle active state
        showToast(
          "success",
          isActive ? "Film removed from favorites!" : "Film added to favorites!"
        );
      } else {
        throw new Error(result.message || "Error toggling the like state.");
      }
    } catch (error) {
      // Call the showToast function with an error message
      showToast("error", error.message || "Failed to toggle the like state.");
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
