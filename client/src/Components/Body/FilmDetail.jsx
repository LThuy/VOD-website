import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStar, faCirclePlay, faSpinner, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import '../../Style/BodyCss/FilmDetail.css'
import '../../Style/All/grid.css'
import '../../Style/Responsive/Responsive.css'
import fetchingApiData from '../../Ultil/FetchingData/FetchingApi'
import { useHandleCLickWatchFilm } from '../../Ultil/Hepler/navigationHelpers'
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText'
import LikeButton from '../Parts/LikeButton';

function FilmDetail() {
    const { slug } = useParams();
    const [loading, setLoading] = useState(false);
    const [film, setFilm] = useState({});
    const [actors, setActors] = useState([])
    const [countries, setCountries] = useState([])
    const [directors, setDirectors] = useState([])
    const [category, setCategory] = useState([])
    const [embedUrl, setEmbedUrl] = useState('')
    const handleClickFilmDetail = useHandleClickFilmDetail()
    const handleClickWathFilm = useHandleCLickWatchFilm()
    const handleTruncateText = useHandleTruncateText()
    const [similarFilms, setSimilarFilms] = useState([]);
    const imgUrl = 'https://img.phimapi.com/'


    //trailer handling
    const trailerRef = useRef(null);
    const scrollToTrailer = () => {
        if (trailerRef.current) {
            trailerRef.current.classList.add('open');
            trailerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [phimDetailData] = await fetchingApiData([
                    `https://phimapi.com/phim/${slug}`,
                ]);

                if (phimDetailData && phimDetailData.movie) {
                    setFilm(phimDetailData.movie)
                    setActors(phimDetailData.movie.actor || []);
                    setCountries(phimDetailData.movie.country || []);
                    setDirectors(phimDetailData.movie.director || []);
                    setCategory(phimDetailData.movie.category || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false)
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [slug])
    useEffect(() => {
        //finding the same category
        const fetchSimilarFilms = async () => {
            let urlFilmSame = ''
            const typeFilm = film.type

            // Determine the URL to fetch based on the film type
            if (typeFilm === 'single') {
                urlFilmSame = "https://phimapi.com/v1/api/danh-sach/phim-le?limit=24";
            } else if (typeFilm === 'series') {
                urlFilmSame = "https://phimapi.com/v1/api/danh-sach/phim-bo?limit=24";
            } else if (typeFilm === 'tvshows') {
                urlFilmSame = "https://phimapi.com/v1/api/danh-sach/tv-shows?limit=24";
            } else if (typeFilm === 'hoathinh') {
                urlFilmSame = "https://phimapi.com/v1/api/danh-sach/hoat-hinh?limit=24";
            }

            try {
                // Fetch the films based on the selected type
                const response = await axios.get(urlFilmSame);
                const similarFilmsFather = response.data;
                const similarFilmsChild = similarFilmsFather.data.items;

                const currentFilmCategories = film.category.map(cat => cat.slug);
                const arraySimilar = [];
                const filmIds = new Set();

                // Filter similar films based on matching categories
                similarFilmsChild.forEach(similarFilm => {
                    similarFilm.category.forEach(category => {
                        if (currentFilmCategories.includes(category.slug)) {
                            const filmId = similarFilm._id;
                            if (!filmIds.has(filmId)) {
                                arraySimilar.push(similarFilm);
                                filmIds.add(filmId);
                            }
                        }
                    });
                });
                setSimilarFilms(arraySimilar);
            } catch (error) {
                console.error('Error fetching similar films:', error);
            }
        }
        fetchSimilarFilms();
    }, [film])


    useEffect(() => {

        window.scrollTo(0, 0);
    }, []);

    const extractYouTubeID = (url) => {
        try {
            if (!url || !url.startsWith('http')) {
                throw new Error("Invalid URL");
            }
            const urlObj = new URL(url);
            return urlObj.searchParams.get("v");
        } catch (error) {
            console.error("Error extracting YouTube ID:", error.message);
            return null;
        }
    };

    useEffect(() => {
        if (film) {
            document.title = film.name || 'Loading...';
            const ytbUrlTrailer = film.trailer_url;
            const videoID = extractYouTubeID(ytbUrlTrailer);
            setEmbedUrl(`https://www.youtube.com/embed/${videoID}`)
        }
    }, [film]);

    // render user's email
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const userid = localStorage.getItem("userId");
        if (userid) {
            setUserId(userid);
        }
    }, []);


    return (
        <div>
            <div className="filmdetail-section">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-item">
                            <FontAwesomeIcon className='icon-loading' icon={faSpinner} spin size="3x" />
                            <h2>Thông cảm! Đợi chút nha...</h2>
                        </div>
                    </div>
                ) : (
                    <div className="filmdetail-container">
                        <div className="filmdetail-container-grid">
                            <div className="filmdetail-container-poster">
                                <div className="filmimg-container">
                                    <img id="film-img" src={film.thumb_url} alt={film.name} />
                                    <h1 id="nameFilm">{film.name}</h1>
                                    <h3 id="originameFilm">{`${film.origin_name} (${film.year})`}</h3>
                                    <button onClick={scrollToTrailer} href="#trailer-film" className="trailer-btn" >
                                        <FontAwesomeIcon icon={faYoutube} /> Trailer
                                    </button>
                                    <button onClick={() => handleClickWathFilm(film.slug)} href={`watchFilm.php?name=${film.slug}`} className="watch-btn">
                                        <FontAwesomeIcon icon={faPlay} /> Xem Film
                                    </button>
                                </div>
                            </div>
                            {/* Film Information */}
                            <div className="filmdetail-container-infor">
                                <div className="filmdetaile-infor-item">
                                    <h4 className="filmdetaile-infor-item_type">Bạn thích phim này chứ?</h4>
                                    <LikeButton filmId={film._id} userId={userId} />
                                    <p id="filmdetaile-infor-item-ratingstart-content"></p>
                                    <p id="rating-stars-response"></p>
                                    <h4 className="gern-info filmdetaile-infor-item_type">Genre: <span className="filmdetaile-infor-item_info">
                                        {category.map((cat, index) => (
                                            <span key={cat.id || index}>
                                                {cat.name}
                                                {index < category.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </span></h4>
                                    <h4 className="filmdetaile-infor-item_type">Actors: <span className="filmdetaile-infor-item_info">
                                        {actors.map((actor, index) => (
                                            <span key={actor.id || index}>
                                                {actor}
                                                {index < actor.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </span></h4>
                                </div>
                                <div className="filmdetaile-infor-item">
                                    <h4 className="filmdetaile-infor-item_type">Year: <span className="filmdetaile-infor-item_info">{film.year}</span></h4>
                                    <h4 className="filmdetaile-infor-item_type">Director: <span className="filmdetaile-infor-item_info">
                                        {directors.map((director, index) => (
                                            <span key={director.id || index}>
                                                {director}
                                                {index < directors.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </span></h4>
                                </div>
                                <div className="filmdetaile-infor-item">
                                    <h4 className="filmdetaile-infor-item_type">Country: <span className="filmdetaile-infor-item_info">
                                        {countries.map((country, index) => (
                                            <span key={index}>
                                                {country.name}
                                                {index < countries.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}</span></h4>
                                    <h4 className="filmdetaile-infor-item_type">Duration: <span className="filmdetaile-infor-item_info"><span id="duration">{film.time}</span></span></h4>
                                </div>
                                <div className="filmdetaile-infor-item">
                                    <h4 className="filmdetaile-infor-item_type">Quality: <span className="filmdetaile-infor-item_info">{film.quality}</span></h4>
                                    <h4 className="filmdetaile-infor-item_type">Status: <span className="filmdetaile-infor-item_info"><span id="duration">{film.episode_current}</span></span></h4>
                                </div>
                                <div className="filmdetaile-infor-review">
                                    <h4 className="filmdetaile-infor-item_type">Review Film</h4>
                                    <p>{film.content}</p>
                                </div>
                            </div>
                            {/* Video Trailer */}
                            <div id="trailer-film" ref={trailerRef} className="filmdetail-container-video">
                                <iframe className="filmdetail-video" src={embedUrl} width="640" height="480" allowFullScreen></iframe>
                            </div>
                            {/* Similar Films */}
                            <div className="filmdetail-container-similarfilm">
                                <h1 className='mb-4'>CÓ THỂ BẠN CŨNG MUỐN XEM</h1>
                                <div className="filmdetail-container-similarfilm-grid">
                                    <div className='row'>
                                        {similarFilms && similarFilms.map(item => (
                                            <div key={item._id} onClick={() => handleClickFilmDetail(item.slug)} className="film-item col-6 col-xl-3 col-md-4">
                                                <div className="film-item-img-container">
                                                    <img src={imgUrl + item.poster_url} alt={item.name} />
                                                </div>
                                                <div className="film-item-iconplay">
                                                    <FontAwesomeIcon className='fa-circle-play' icon={faCirclePlay} />
                                                </div>
                                                <h4>{handleTruncateText(item.name)}</h4>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FilmDetail