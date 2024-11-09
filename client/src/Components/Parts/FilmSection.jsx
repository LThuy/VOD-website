import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Style/BodyCss/Home.css'
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';

const FilmSection = React.memo(({ title, films, linkTo, handleClick, truncateText }) => (
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
          </div>
          <div className="film-item-iconplay">
            <FontAwesomeIcon className='fa-circle-play' icon={faCirclePlay} />
          </div>
          <h4>{truncateText(item.name)}</h4>
        </div>
      ))}
    </div>
  </>
));

export default FilmSection;