import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import '../../Style/BodyCss/Home.css';
import '../../Style/All/grid.css';
import '../../Style/Responsive/Responsive.css';
import Pagination from '../Pagination/Pagination';
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function GenreFilm() {
    const { slug } = useParams();
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const imgUrl = 'https://img.phimapi.com/';
    const handleClickFilmDetail = useHandleClickFilmDetail();
    const handleTruncateText = useHandleTruncateText();

    const specialGenre = {
        "hanh-dong": "HÀNH ĐỘNG",
        "tinh-cam": "TÌNH CẢM",
        "hai-huoc": "HÀI HƯỚC",
        "gia-dinh": "GIA ĐÌNH",
        "chinh-kich": "CHÍNH KỊCH",
        "hoat-hinh": "HOẠT HÌNH",
        "khoa-hoc": "KHOA HỌC",
        "phieu-luu": "PHIÊU LƯU",
        "chien-tranh": "CHIẾN TRANH",
        "the-thao": "THỂ THAO",
        "lich-su": "LỊCH SỬ",
        "bi-an": "BÍ ẨN",
        "tam-li": "TÂM LÍ",
        "co-trang": "CỔ TRANG",
        "vo-thua": "VÕ TRANG",
        "kinh-di": "KINH DỊ",
        "vien-tuong": "VIỄN TƯỞNG"
    };

    useEffect(() => {
        const fetchFilmsByGenre = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Assuming your API endpoint follows this structure
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/film/genre/${slug}?page=${currentPage}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch films');
                }

                const data = await response.json();
                
                setFilms(data.items);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching films:', error);
                setError('Failed to load films. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchFilmsByGenre();
    }, [slug, currentPage]);

    useEffect(() => {
        document.title = specialGenre[slug] || '';
    }, [slug]);

    const renderSkeletonLoader = () => (
        <>
            <div className="row header-container">
                <div className="film-header-container">
                    <Skeleton height={40} width="100%" baseColor="#e0e0e0" highlightColor="#f5f5f5" />
                </div>
            </div>
            <div className='row'>
                {[...Array(12)].map((_, index) => (
                    <div
                        key={index}
                        className="film-item col-6 col-sm-4 col-md-4 col-lg-2"
                    >
                        <div className="film-item-img-container">
                            <Skeleton height={270} width="100%" />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    return (
        <div>
            <div className="maincontainer">
                <div className="grid">
                    {loading ? (
                        renderSkeletonLoader()
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : (
                        <>
                            <div className="row header-container">
                                <div className="film-header-container">
                                    <h1 className="film-item_header">
                                        {`${specialGenre[slug]} - TRANG ${currentPage}`}
                                    </h1>
                                </div>
                            </div>
                            <div className='row'>
                                {films.length > 0 ? (
                                    films.map(item => (
                                        <div
                                            key={item._id}
                                            onClick={() => handleClickFilmDetail(item.slug)}
                                            className="film-item col col-lg-2 col-md-4"
                                        >
                                            <div className="film-item-img-container">
                                                <img src={item.poster_url} alt={item.name} />
                                            </div>
                                            <div className="film-item-iconplay">
                                                <FontAwesomeIcon className='fa-circle-play' icon={faCirclePlay} />
                                            </div>
                                            <h4>{handleTruncateText(item.name)}</h4>
                                        </div>
                                    ))
                                ) : (
                                    <div className="error-message">No results found</div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GenreFilm;