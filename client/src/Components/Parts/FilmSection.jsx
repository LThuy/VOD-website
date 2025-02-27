import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/BodyCss/Home.scss';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';  // Import skeleton loader library
import 'react-loading-skeleton/dist/skeleton.css';  // Import skeleton styles

const FilmSection = React.memo(({ isLoading, title, films, linkTo, handleClick, truncateText }) => {
  // If data is loading, show skeleton loader
  if (isLoading) {
    return (
      <>
        <div className="row">
          <div className='header-container'>
            <div className="film-header-container">
              <h1 className="film-item_header">
                <Skeleton width="200px" />
              </h1>
            </div>
            <div className="film-seeAll-container">
              <Skeleton width="100px" height={30}/>
            </div>
          </div>
        </div>
        <div className="row">
          {[...Array(6)].map((_, index) => (  // Create 6 skeletons as placeholders
            <div key={index} className="film-item col-6 col-lg-2 col-md-4">
              <div className="film-item-img-container">
                <Skeleton height={250} width="100%" />
              </div>
              <Skeleton width="80%" height={20} />
            </div>
          ))}
        </div>
      </>
    );
  }

  // When data is loaded, render the film section
  return (
    <>
      <div className="row">
        <div className='header-container'>
          <div className="film-header-container">
            <h1 className="film-item_header">{title}</h1>
          </div>
          <div className="film-seeAll-container">
            <Link to={linkTo} className="film-item_seeAll">Xem tất cả</Link>
          </div>
        </div>
      </div>
      <div className="row">
        {films.map(item => (
          <div key={item._id} onClick={() => handleClick(item.slug)} className="film-item col col-lg-2 col-md-4">
            <div className="film-item-img-container">
              <img 
                src={item.poster_url.startsWith('http') ? item.poster_url : `https://img.phimapi.com/${item.poster_url}`} 
                alt={item.name} 
                loading="lazy" 
              />
              <div className="film-item-iconplay">
              <FontAwesomeIcon className='fa-circle-play' icon={faCirclePlay} />
            </div>
            </div>
            {/* <div className="film-item-iconplay">
              <FontAwesomeIcon className='fa-circle-play' icon={faCirclePlay} />
            </div> */}
            <h4>{truncateText(item.name)}</h4>
          </div>
        ))}
      </div>
    </>
  );
});

export default FilmSection;
