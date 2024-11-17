import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faStar,faSpinner,faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import '../../Style/BodyCss/FilmDetail.css'
import '../../Style/All/grid.css'
import '../../Style/Responsive/Responsive.css'
import '../../Style/BodyCss/Home.css'
import fetchingApiData from '../../Ultil/FetchingData/FetchingApi'
import {useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import {useHandleTruncateText} from '../../Ultil/Hepler/truncateText'

function WatchFilm () {
    const { slug } = useParams();
    const [film, setFilm] = useState({});
    const [loading, setLoading] = useState(false);
    const [actors, setActors] = useState([])
    const [countries, setCountries] = useState([])
    const [directors, setDirectors] = useState([])
    const [category, setCategory] = useState([])
    const [currentEpisode, setCurrentEpisode] = useState('FullHD | Vietsub')
    const [episodes, setEpisodes] = useState([])
    const [selectedEpisode, setSelectedEpisode] = useState('');
    const handleClickFilmDetail = useHandleClickFilmDetail()
    const handleTruncateText = useHandleTruncateText()
    const [similarFilms, setSimilarFilms] = useState([]);
    const imgUrl = 'https://img.phimapi.com/'
   
    const handleEpisodeClick = (link_embed, currentEpisode) => {
        window.scrollTo(0, 0);
        setSelectedEpisode(link_embed);
        setCurrentEpisode(currentEpisode)
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
                    setEpisodes(phimDetailData.episodes || []);
                    
                    if (phimDetailData.episodes.length > 0 && phimDetailData.episodes[0].server_data.length > 0) {
                        const firstLinkEmbed = phimDetailData.episodes[0].server_data[0].link_embed;
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
        const fetchSimilarFilms = async () => {
            let urlFilmSame = ''
            const typeFilm = film.type

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
                const response = await axios.get(urlFilmSame);
                const similarFilmsFather = response.data;
                const similarFilmsChild = similarFilmsFather.data.items;

                const currentFilmCategories = film.category.map(cat => cat.slug);
                const arraySimilar = [];
                const filmIds = new Set();

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

        fetchData();
        fetchSimilarFilms()

        
    },[slug])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (film) {
            document.title = film.name || '';
        }
    }, [film]);

    return (
        <div>
            <div className="filmdetail-section">
                <div className="filmdetail-container">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-item">
                                <FontAwesomeIcon className='icon-loading' icon={faSpinner} spin size="3x" />
                                <h2 className='mt-3'>Thông cảm! Đợi chút nha...</h2>
                            </div>
                        </div>
                    ): (
                        <div className="filmdetail-container-grid">
                        <div className="filmdetail-container-poster">
                            <div className="filmimg-container">
                                <div className="filmimg-container_filmName_container">
                                    <h3 className="filmimg-container_filmName">{`${film.name} - ${currentEpisode}`}</h3>
                                </div>

                                {/* Embedded Video */}
                                <iframe
                                    className="filmdetail-video"
                                    src={selectedEpisode}
                                    frameBorder="0"
                                    width="auto"
                                    height="480"
                                    allowFullScreen
                                    title="Film Video"
                                ></iframe>

                                {/* Episode Header */}
                                <h3 className="episode-header">Danh Sách Tập Phim</h3>

                                {/* Episode Buttons */}
                                <div className="episodeBtn-container">
                                    {episodes.map((episode, episodeIndex) => (
                                        episode.server_data.map((server, serverIndex) => (
                                            <button
                                                key={`${episodeIndex}-${serverIndex}`}
                                                data-link={server.link_embed}
                                                className={`episode-button ${selectedEpisode === server.link_embed ? 'active' : ''}`}
                                                onClick={() => handleEpisodeClick(server.link_embed, server.name)}
                                            >
                                                {server.name}
                                            </button>
                                        ))
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
                    )}
                </div>
            </div>
        </div>
    )
}

export default WatchFilm