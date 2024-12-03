// src/components/Home.js
import React, { useEffect, useMemo, Suspense } from 'react';
import '../../Style/BodyCss/Home.css';
import '../../Style/All/grid.css';
import '../../Style/Responsive/Responsive.css';
import useMovieData from '../../Hooks/useMovieData';
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText';
// import FilmSection from '../Parts/FilmSection';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const FilmSection = React.lazy(() => import('../Parts/FilmSection'));

function Home() {
  const { movieData, isLoading } = useMovieData();
  const { phimmoiCN, phimLe, phimBo, phimHH, tvShows, slider } = movieData;

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

  if (isLoading)
    return (
      <div>
        <div className="slider-container">
          <div className="slider">
            <Skeleton height={500} width={1000} baseColor="#e0e0e0" highlightColor="#f5f5f5" />
          </div>
        </div>
        <div className="maincontainer">
          <div className="grid home-container">
            <FilmSection isLoading={isLoading} title="PHIM MỚI CẬP NHẬT" films={phimmoiCN} linkTo="/danh-sach/phim-moi-cap-nhat" handleClick={handleClickFilmDetail} truncateText={handleTruncateText} />
            <FilmSection isLoading={isLoading} title="PHIM LẺ" films={phimLe} linkTo="/danh-sach/phim-le" handleClick={handleClickFilmDetail} truncateText={handleTruncateText} />
            <FilmSection isLoading={isLoading} title="PHIM BỘ" films={phimBo} linkTo="/danh-sach/phim-bo" handleClick={handleClickFilmDetail} truncateText={handleTruncateText} />
            <FilmSection isLoading={isLoading} title="PHIM HOẠT HÌNH" films={phimHH} linkTo="/danh-sach/hoat-hinh" handleClick={handleClickFilmDetail} truncateText={handleTruncateText} />
            <FilmSection isLoading={isLoading} title="TV SHOWS" films={tvShows} linkTo="/danh-sach/tv-shows" handleClick={handleClickFilmDetail} truncateText={handleTruncateText} />
          </div>
        </div>
      </div>
    )

  return (
    <div>
      {/* Render slider if needed */}
      {renderSlider}

      <div className="maincontainer">
        <div className="grid home-container">
          {/* Lazy load each FilmSection */}
          <Suspense
            fallback={
              <div>
                <Skeleton width="200px" />
                <div className="row">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="film-item col-6 col-lg-2 col-md-4">
                      <div className="film-item-img-container">
                        <Skeleton height={250} width="100%" />
                      </div>
                      <Skeleton width="80%" height={20} />
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <FilmSection
              title="PHIM MỚI CẬP NHẬT"
              films={phimmoiCN}
              linkTo="/danh-sach/phim-moi-cap-nhat"
              handleClick={handleClickFilmDetail}
              truncateText={handleTruncateText}
            />
          </Suspense>

          <Suspense
            fallback={
              <div>
                <Skeleton width="200px" />
                <div className="row">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="film-item col-6 col-lg-2 col-md-4">
                      <div className="film-item-img-container">
                        <Skeleton height={250} width="100%" />
                      </div>
                      <Skeleton width="80%" height={20} />
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <FilmSection
              title="PHIM LẺ"
              films={phimLe}
              linkTo="/danh-sach/phim-le"
              handleClick={handleClickFilmDetail}
              truncateText={handleTruncateText}
            />
          </Suspense>

          <Suspense
            fallback={
              <div>
                <Skeleton width="200px" />
                <div className="row">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="film-item col-6 col-lg-2 col-md-4">
                      <div className="film-item-img-container">
                        <Skeleton height={250} width="100%" />
                      </div>
                      <Skeleton width="80%" height={20} />
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <FilmSection
              title="PHIM BỘ"
              films={phimBo}
              linkTo="/danh-sach/phim-bo"
              handleClick={handleClickFilmDetail}
              truncateText={handleTruncateText}
            />
          </Suspense>

          <Suspense
            fallback={
              <div>
                <Skeleton width="200px" />
                <div className="row">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="film-item col-6 col-lg-2 col-md-4">
                      <div className="film-item-img-container">
                        <Skeleton height={250} width="100%" />
                      </div>
                      <Skeleton width="80%" height={20} />
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <FilmSection
              title="PHIM HOẠT HÌNH"
              films={phimHH}
              linkTo="/danh-sach/hoat-hinh"
              handleClick={handleClickFilmDetail}
              truncateText={handleTruncateText}
            />
          </Suspense>

          <Suspense
            fallback={
              <div>
                <Skeleton width="200px" />
                <div className="row">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="film-item col-6 col-lg-2 col-md-4">
                      <div className="film-item-img-container">
                        <Skeleton height={250} width="100%" />
                      </div>
                      <Skeleton width="80%" height={20} />
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <FilmSection
              title="TV SHOWS"
              films={tvShows}
              linkTo="/danh-sach/tv-shows"
              handleClick={handleClickFilmDetail}
              truncateText={handleTruncateText}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Home;