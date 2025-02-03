import React, { useState, useEffect } from "react";
import "../../Style/BodyCss/Profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText'
import Skeleton from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 

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

        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/film/getfavorites/${userId}`);
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
    return <div className="profiledetail-section">
      <div className="profiledetail-container">
        <div className="profiledetail-container-grid">
          <div className="profiledetail-container-item">
            <div className="profiledetail-container-item_header">
              <Skeleton height={50} width="100%" baseColor="#e0e0e0" highlightColor="#f5f5f5"/>
            </div>
            <div className="profiledetail-container-item-info">
              <div className="row favfilm-container">
                {
                  [...Array(3)].map((_, index) => (
                    <div key={index} className="film-item col-6 col-lg-3 col-md-3 col-sm-4 col-xl-4">
                        <div className="film-item-img-container">
                            <Skeleton height={270} width={200} baseColor="#e0e0e0" highlightColor="#f5f5f5"/>
                        </div>
                        <div className="film-item-iconplay">
                            <Skeleton circle width={30} height={30} baseColor="#e0e0e0" highlightColor="#f5f5f5"/>
                        </div>
                        <Skeleton width="80%" height={20} baseColor="#e0e0e0" highlightColor="#f5f5f5"/>
                    </div>
                ))
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                {favoriteFilms && favoriteFilms.length > 0 ? (
                  favoriteFilms.slice().reverse().map((item) => (
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
