// src/components/Home.js
import React, { useEffect, useMemo } from 'react';
import '../../Style/BodyCss/Home.css';
import '../../Style/All/grid.css';
import '../../Style/Responsive/Responsive.css';
import useMovieData from '../../Hooks/useMovieData';
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText';
import FilmSection from '../Parts/FilmSection';

function Home() {
  const { phimmoiCN, phimLe, phimBo, phimHH, tvShows, slider } = useMovieData();
  const handleClickFilmDetail = useHandleClickFilmDetail();
  const handleTruncateText = useHandleTruncateText();

  useEffect(() => {
    document.title = "Trang Chủ";
  }, []);

  useEffect(() => {
    if (slider.length > 0) {
      let counter = 1;
      const intervalId = setInterval(() => {
        document.getElementById(`radio${counter}`).checked = true;
        document.querySelector('.slider-container').style.setProperty('--slider-bg', `url(${slider[counter - 1].thumb_url})`);
        counter = counter % 4 + 1;
      }, 4000);

      return () => clearInterval(intervalId);
    }
  }, [slider]);

  const renderSlider = useMemo(() => (
    <div className="slider-container">
      <div className="slider">
        <div className="slides">
          {[1, 2, 3, 4].map(i => (
            <input key={i} type="radio" name="radio-btn" id={`radio${i}`} />
          ))}
          {slider.map((slide, index) => (
            <div key={slide._id} className={`slide ${index === 0 ? 'first' : ''}`}>
              <h4>{slide.name}</h4>
              <h5>{slide.origin_name}<span> ({slide.year})</span></h5>
              <button onClick={() => handleClickFilmDetail(slide.slug)} className="watch-btn_slider">Watch</button>
              <img src={slide.thumb_url} alt={`slide${index + 1}`} loading="lazy" />
            </div>
          ))}
          <div className="navigation-auto">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`auto-btn${i}`}></div>
            ))}
          </div>
        </div>
        <div className="navigaiton-manual">
          {[1, 2, 3, 4].map(i => (
            <label key={i} htmlFor={`radio${i}`} className="manual-btn"></label>
          ))}
        </div>
      </div>
    </div>
  ), [slider, handleClickFilmDetail]);

  return (
    <div>
      {renderSlider}
      <div className="maincontainer">
        <div className="grid home-container">
          <FilmSection title="PHIM MỚI CẬP NHẬT" films={phimmoiCN} linkTo="/danh-sach/phim-moi-cap-nhat" handleClick={handleClickFilmDetail} truncateText={handleTruncateText} />
          <FilmSection title="PHIM LẺ" films={phimLe} linkTo="/danh-sach/phim-le" handleClick={handleClickFilmDetail} truncateText={handleTruncateText} />
          <FilmSection title="PHIM BỘ" films={phimBo} linkTo="/danh-sach/phim-bo" handleClick={handleClickFilmDetail} truncateText={handleTruncateText} />
          <FilmSection title="PHIM HOẠT HÌNH" films={phimHH} linkTo="/danh-sach/hoat-hinh" handleClick={handleClickFilmDetail} truncateText={handleTruncateText} />
          <FilmSection title="TV SHOWS" films={tvShows} linkTo="/danh-sach/tv-shows" handleClick={handleClickFilmDetail} truncateText={handleTruncateText} />
        </div>
      </div>
    </div>
  );
}

export default Home;