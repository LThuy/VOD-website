import React, { useState, useEffect } from "react";
import "../../Style/BodyCss/Profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText'

const FavoriteFilm = () => {
  const [favoriteFilms, setFavoriteFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const hanldeClickFilmDetail = useHandleClickFilmDetail();
  const imgUrl = 'https://img.phimapi.com/'
  const hanldeTruncateText = useHandleTruncateText()

  useEffect(() => {
    const userid = localStorage.getItem("userId");
    if (userid) {
      setUserId(userid);
    }
  }, []);

  // Fetch favorite films when userId is available
  useEffect(() => {
    const fetchFavoriteFilms = async () => {
      if (!userId) {
        console.log("No user ID available yet");
        return;
      }

      try {

        const response = await fetch(`http://localhost:5000/film/getfavorites/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch favorite films');
        }

        const data = await response.json();
        setFavoriteFilms(data); // Store the films in state
      } catch (err) {
        setError(err.message); // Set error if any
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    if (userId) {
      fetchFavoriteFilms(); // Only call the fetch if userId is set
    }
  }, [userId]);


  // Render loading state or error message if applicable
  if (loading) {
    return <div className="loading-container">
      <div className="loading-item">
        <FontAwesomeIcon className='icon-loading' icon={faSpinner} spin size="3x" />
        <h2>Thông cảm! Đợi chút nha...</h2>
      </div>
    </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  console.log(favoriteFilms)

  return (
    <div className="profiledetail-section">
      <div className="profiledetail-container">
        <div className="profiledetail-container-grid">
          <div className="profiledetail-container-item">
            <div className="profiledetail-container-item_header">
              <h1>Favorite Film List</h1>
            </div>
            <div className="profiledetail-container-item-info">
              <div className="row favfilm-container">
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-item">
                      <FontAwesomeIcon className="icon-loading" icon={faSpinner} spin size="3x" />
                      <h2 className="mt-3">Thông cảm! Đợi chút nha...</h2>
                    </div>
                  </div>
                ) : favoriteFilms && favoriteFilms.length > 0 ? (
                  favoriteFilms.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => hanldeClickFilmDetail(item.slug)}
                      className="film-item col-6 col-lg-3 col-md-3 col-sm-4 col-xl-4"
                    >
                      <div className="film-favorite-item-img-container">
                        <img src={item.poster_url} alt={item.name} />
                      </div>
                      <div className="filmfavorite-item-iconplay">
                        <FontAwesomeIcon className="fa-circle-play" icon={faCirclePlay} />
                      </div>
                      <h4>{hanldeTruncateText(item.name)}</h4>
                    </div>
                  ))
                ) : (
                  <div className="no-films-message">
                    <h2>Không có phim yêu thích nào!</h2>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteFilm;
