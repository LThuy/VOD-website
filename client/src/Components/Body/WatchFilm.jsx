import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSpinner, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import '../../Style/BodyCss/FilmDetail.css'
import '../../Style/All/grid.css'
import '../../Style/Responsive/Responsive.css'
import '../../Style/BodyCss/Home.scss'
import fetchingApiData from '../../Ultil/FetchingData/FetchingApi'
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'video.js/dist/video-js.css'; 
import VideoPlayerHLS from '../Parts/VideoPlayer';

function WatchFilm() {
    const { slug } = useParams();
    const [film, setFilm] = useState({});
    const [loading, setLoading] = useState(false);
    const [actors, setActors] = useState([])
    const [countries, setCountries] = useState([])
    const [directors, setDirectors] = useState([])
    const [category, setCategory] = useState([])
    const [currentEpisode, setCurrentEpisode] = useState('FullHD | Vietsub')
    const [episodes, setEpisodes] = useState([])
    const [thumbnail, setThumbnail] = useState('')
    const [poster, setPoster] = useState('')
    const [selectedEpisode, setSelectedEpisode] = useState('');
    const handleClickFilmDetail = useHandleClickFilmDetail()
    const handleTruncateText = useHandleTruncateText()
    const [similarFilms, setSimilarFilms] = useState([]);
    const imgUrl = 'https://img.phimapi.com/'
    const [userId, setUserId] = useState(null);

    const handleEpisodeClick = (link_embed, currentEpisode) => {
        window.scrollTo(0, 0);
        setSelectedEpisode(link_embed); 
        setCurrentEpisode(currentEpisode)
    };

    useEffect(() => {
        // Automatically click the first button of the first server if available
        if (episodes.length > 0 && episodes[0].server_data.length > 0) {
            const firstServer = episodes[0].server_data[0];
            handleEpisodeClick(firstServer.link_m3u8, firstServer.name);
        }
    }, [episodes, handleEpisodeClick]);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const phimDetailData = await fetchingApiData([
                    `${process.env.REACT_APP_SERVER_BASE_URL}/film/${slug}`,
                ]);

                if (phimDetailData[0]) {
                    setFilm(phimDetailData[0])
                    setActors(phimDetailData[0].actor || []);
                    setCountries(phimDetailData[0].country || []);
                    setDirectors(phimDetailData[0].director || []);
                    setCategory(phimDetailData[0].category || []);
                    setEpisodes(phimDetailData[0].episodes || []);
                    setThumbnail(phimDetailData[0].thumb_url || []);
                    setPoster(phimDetailData[0].poster_url || []);

                    if (phimDetailData.episodes.length > 0 && phimDetailData.episodes[0].server_data.length > 0) {
                        const firstLinkEmbed = phimDetailData.episodes[0].server_data[0].link_m3u8;
                        setSelectedEpisode(firstLinkEmbed);
                    } else {
                        console.log('No episodes or server data found');
                    }
                } else {
                    console.log('No movie data found in response');
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug])
    useEffect(() => {
        if (!film?._id) return;

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
    }, [film?._id, film?.type, film?.category]);



    useEffect(() => {
        if (film) {
            document.title = film.name || '';
        }
        const fetchData = async () => {

            const userid = localStorage.getItem("userId");
            if (userid) {
                setUserId(userid);
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/film/addToHistory`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userid, // Use userid here, as you set it earlier
                        filmData: film, // Make sure film is defined somewhere in your component
                    }),
                });

                const data = await response.json();
            } catch (err) {
                console.error('Error saving to history', err);
            }
        };

        fetchData(); // Call the async function inside useEffect
    }, [film]); // Add film as dependency to run the effect whenever film changes

    if (loading) {
        return (
            <div className="filmdetail-section">
                <div className="filmdetail-container">
                    <div className="filmdetail-container-grid">
                        <div className="filmdetail-container-poster">
                            <div className="filmimg-container">
                                <Skeleton height={50} width="40%" baseColor="#e0e0e0" highlightColor="#f5f5f5" />
                                {/* Embedded Video */}
                                <Skeleton height={480} width="100%" baseColor="#e0e0e0" highlightColor="#f5f5f5" />

                                {/* Episode Header */}
                                <Skeleton height={50} width="30%" baseColor="#e0e0e0" highlightColor="#f5f5f5" />

                                {/* Episode Buttons */}
                                <div className="episodeBtn-container">
                                    {
                                        [...Array(10)].map((_, index) => (
                                            <div key={index} className="skeleton-episode-button ms-3">
                                                <Skeleton height={40} width={80} />
                                            </div>
                                        ))

                                    }
                                </div>
                            </div>
                        </div>
                        {/* Film Information */}
                        <Skeleton height={380} width="100%" baseColor="#e0e0e0" highlightColor="#f5f5f5" />
                        {/* Similar Films */}
                        <div className="filmdetail-container-similarfilm">
                            <h1>CÓ THỂ BẠN CŨNG MUỐN XEM</h1>
                            <div className="filmdetail-container-similarfilm-grid">
                                <div className="row">
                                    {
                                        [...Array(4)].map((_, index) => (
                                            <div key={index} className="film-item col-6 col-xl-3 col-md-4">
                                                <div className="film-item-img-container">
                                                    <Skeleton height={270} width={200} baseColor="#e0e0e0" highlightColor="#f5f5f5" />
                                                </div>
                                                <div className="film-item-iconplay">
                                                    <Skeleton circle width={30} height={30} baseColor="#e0e0e0" highlightColor="#f5f5f5" />
                                                </div>
                                                <Skeleton width="80%" height={20} baseColor="#e0e0e0" highlightColor="#f5f5f5" />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="filmdetail-section">
                <div className="filmdetail-container">
                    <div className="filmdetail-container-grid">
                        <div className="filmdetail-container-poster">
                            <div className="filmimg-container">
                                <div className="filmimg-container_filmName_container">
                                    <h3 className="filmimg-container_filmName">{`${film.name} - ${currentEpisode}`}</h3>
                                </div>

                                {/* Embedded Video */}
                                <div
                                    className="filmdetail-video"
                                    title="Film Video"
                                    style={{
                                        height: '480px',
                                        width: '100%',
                                    }}
                                >
                                    <VideoPlayerHLS
                                        selectedEpisode={selectedEpisode}
                                        thumbnail = {thumbnail}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            marrgin: '0',
                                        }}
                                        poster={poster}
                                    />
                                </div>

                                
                                {/* Episode Header */}
                                <h3 className="episode-header">Danh Sách Tập Phim</h3>

                                {/* Episode Buttons */}
                                <div className="episodeBtn-container">
                                    {/* {episodes.map((episode, episodeIndex) => (
                                        <div key={episodeIndex}>
                                            <h5 style={{color: "white"}}>{episode.server_name}</h5>
                                            {episode.server_data.map((server, serverIndex) => (
                                                <button
                                                    key={`${episodeIndex}-${serverIndex}`}
                                                    data-link={server.link_embed}
                                                    className={`episode-button ${selectedEpisode === server.link_embed ? 'active' : ''}`}
                                                    onClick={() => handleEpisodeClick(server.link_embed, server.name)}
                                                >
                                                    {server.name}
                                                </button>
                                            ))}
                                        </div>
                                    ))} */}
                                     {episodes.map((episode, episodeIndex) => (
                                        <div key={episodeIndex}>
                                            <h5 style={{ color: 'white' }}>{episode.server_name}</h5>
                                            {episode.server_data.map((server, serverIndex) => (
                                                <button
                                                    key={`${episodeIndex}-${serverIndex}`}
                                                    data-link={server.link_m3u8}
                                                    className={`episode-button ${selectedEpisode === server.link_m3u8 ? 'active' : ''}`}
                                                    onClick={() => handleEpisodeClick(server.link_m3u8, server.name)}
                                                >
                                                    {server.name}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                        {/* Film Information */}
                        <div className="filmdetail-container-infor">
                            <div className="filmdetaile-infor-item">
                                <h4 className="filmdetaile-infor-item_type">Rating star:</h4>
                                <div className="rating-stars">
                                    {[...Array(10)].map((_, i) => (
                                        <span className="star" key={i} data-rating={i + 1}>
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                    ))}
                                </div>
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
                        {/* Similar Films */}
                        <div className="filmdetail-container-similarfilm">
                            <h1>CÓ THỂ BẠN CŨNG MUỐN XEM</h1>
                            <div className="filmdetail-container-similarfilm-grid">
                                <div className="row">
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

export default WatchFilm