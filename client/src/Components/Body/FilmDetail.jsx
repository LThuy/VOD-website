import React, { useEffect, useState, useRef, useCallback, useMemo, Suspense, lazy } from 'react';
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
import { toast } from "react-toastify";
import CommentSection from '../Parts/Comment';


function FilmDetail() {
    const { slug } = useParams();
    const [loading, setLoading] = useState(false);
    const [film, setFilm] = useState({});
    const [actors, setActors] = useState([]);
    const [countries, setCountries] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [category, setCategory] = useState([]);
    const [embedUrl, setEmbedUrl] = useState('');
    const [similarFilms, setSimilarFilms] = useState([]);
    const [userId, setUserId] = useState(null);

    const trailerRef = useRef(null);
    const imgUrl = 'https://img.phimapi.com/';

    const handleClickFilmDetail = useHandleClickFilmDetail();
    const handleClickWathFilm = useHandleCLickWatchFilm();
    const handleTruncateText = useHandleTruncateText();



    useEffect(() => {
        window.scrollTo(0, 0);
        const userid = localStorage.getItem("userId");
        if (userid) {
            setUserId(userid);
        }
    }, []);

    const showToast = useCallback((type, message) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message);
        }
    }, []);

    const categoryNames = useMemo(() => {
        return category.map((cat, index) => (
            <span key={cat.id || index}>
                {cat.name}
                {index < category.length - 1 ? ', ' : ''}
            </span>
        ));
    }, [category]);

    const actorNames = useMemo(() => {
        return actors.map((actor, index) => (
            <span key={actor.id || index}>
                {actor}
                {index < actors.length - 1 ? ', ' : ''}
            </span>
        ));
    }, [actors]);

    const countryNames = useMemo(() => {
        return countries.map((country, index) => (
            <span key={index}>
                {country.name}
                {index < countries.length - 1 ? ', ' : ''}
            </span>
        ));
    }, [countries]);

    const directorNames = useMemo(() => {
        return directors.map((director, index) => (
            <span key={director.id || index}>
                {director}
                {index < directors.length - 1 ? ', ' : ''}
            </span>
        ));
    }, [directors]);

    // Fetch film details
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                setLoading(true);
                const [phimDetailData] = await fetchingApiData([`https://phimapi.com/phim/${slug}`]);

                if (phimDetailData?.movie) {
                    const { movie } = phimDetailData;
                    setFilm(movie);
                    setActors(movie.actor || []);
                    setCountries(movie.country || []);
                    setDirectors(movie.director || []);
                    setCategory(movie.category || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]); // Depend on slug

    // Update embed URL and fetch similar films based on film type and category
    useEffect(() => {
        if (!film?._id) return;

        document.title = film.name || 'Loading...';

        const ytbUrlTrailer = film.trailer_url;
        const videoID = extractYouTubeID(ytbUrlTrailer);
        setEmbedUrl(`https://www.youtube.com/embed/${videoID}`);

        const fetchSimilarFilms = async () => {
            const typeMap = {
                'single': 'phim-le',
                'series': 'phim-bo',
                'tvshows': 'tv-shows',
                'hoathinh': 'hoat-hinh'
            };

            const urlFilmSame = typeMap[film.type]
                ? `https://phimapi.com/v1/api/danh-sach/${typeMap[film.type]}?limit=24`
                : null;

            if (!urlFilmSame) return;

            try {
                const response = await axios.get(urlFilmSame);
                const similarFilmsChild = response.data.data.items;

                const currentFilmCategories = film.category.map(cat => cat.slug);
                const filteredFilms = similarFilmsChild.filter(similarFilm =>
                    similarFilm.category.some(category =>
                        currentFilmCategories.includes(category.slug)
                    )
                );

                setSimilarFilms(filteredFilms);
            } catch (error) {
                console.error('Error fetching similar films:', error);
            }
        };

        fetchSimilarFilms();
    }, [film?._id, film?.type, film?.category]); // Only depend on necessary properties

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

    const scrollToTrailer = () => {
        if (trailerRef.current) {
            trailerRef.current.classList.add('open');
            trailerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <div>
            <div className="filmdetail-section">
                <div className="filmdetail-container">
                    {/* Film Details */}
                    <div className="filmdetail-container-grid">
                        <div className="filmdetail-container-poster">
                            <div className="filmimg-container">
                                <img id="film-img" src={film.thumb_url} alt={film.name} />
                                <h1 id="nameFilm">{film.name}</h1>
                                <h3 id="originameFilm">{`${film.origin_name} (${film.year})`}</h3>
                                <button onClick={scrollToTrailer} className="trailer-btn">
                                    <FontAwesomeIcon icon={faYoutube} /> Trailer
                                </button>
                                <button onClick={() => handleClickWathFilm(film.slug)} className="watch-btn">
                                    <FontAwesomeIcon icon={faPlay} /> Xem Film
                                </button>
                            </div>
                        </div>

                        {/* Film Information */}
                        <div className="filmdetail-container-infor">
                            <div className="filmdetaile-infor-item">
                                <h4 className="filmdetaile-infor-item_type">Bạn thích phim này chứ?</h4>
                                <LikeButton filmData={film} userId={userId} showToast={showToast} />
                                <p id="filmdetaile-infor-item-ratingstart-content"></p>
                                <p id="rating-stars-response"></p>
                                <h4 className="gern-info filmdetaile-infor-item_type">Genre: <span className="filmdetaile-infor-item_info">
                                    {categoryNames}
                                </span></h4>
                                <h4 className="filmdetaile-infor-item_type">Actors: <span className="filmdetaile-infor-item_info">
                                    {actorNames}
                                </span></h4>
                            </div>
                            <div className="filmdetaile-infor-item">
                                <h4 className="filmdetaile-infor-item_type">Year: <span className="filmdetaile-infor-item_info">{film.year}</span></h4>
                                <h4 className="filmdetaile-infor-item_type">Director: <span className="filmdetaile-infor-item_info">
                                    {directorNames}
                                </span></h4>
                            </div>
                            <div className="filmdetaile-infor-item">
                                <h4 className="filmdetaile-infor-item_type">Country: <span className="filmdetaile-infor-item_info">
                                    {countryNames}</span></h4>
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
                        <CommentSection userId={userId} filmId={film._id} />
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
            </div>

        </div>
    )
}

export default FilmDetail;
