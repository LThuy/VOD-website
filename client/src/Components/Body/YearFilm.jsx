import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Style/BodyCss/Home.css';
import '../../Style/All/grid.css';
import '../../Style/Responsive/Responsive.css';
import Pagination from '../Pagination/Pagination';
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function YearFilm() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const handleClickFilmDetail = useHandleClickFilmDetail();
    const handleTruncateText = useHandleTruncateText();
    const years = Array.from({ length: 24 }, (_, i) => 2024 - i); // Generate years from 2024 to 2000

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchFilms = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:5000/film/year/${slug || 'all'}?page=${currentPage}`
                );
                const data = await response.json();
                
                setFilms(data.films);
                setTotalPages(data.pagination.totalPages);
            } catch (error) {
                console.error('Error fetching films:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilms();
    }, [slug, currentPage]);

    useEffect(() => {
        document.title = slug ? `Phim Năm ${slug}` : 'Tất Cả Phim';
    }, [slug]);

    const handleYearChange = (year) => {
        navigate(`/year/${year || 'all'}`);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="maincontainer">
                <div className="grid">
                    <div className="row header-container">
                        <div className="film-header-container">
                            <Skeleton height={40} width="100%" />
                        </div>
                    </div>
                    <div className="row">
                        {[...Array(12)].map((_, index) => (
                            <div key={index} className="film-item col-6 col-sm-4 col-md-4 col-lg-2">
                                <div className="film-item-img-container">
                                    <Skeleton height={270} width="100%" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="maincontainer-searchResult">
            <div className="grid">
                <div className="row header-container">
                    <div className="film-header-container">
                        <h1 className="film-item_header">
                            {slug ? `PHIM HAY NĂM ${slug}` : 'TẤT CẢ PHIM'} - TRANG {currentPage}
                        </h1>
                        <div className="year-filter">
                            <label htmlFor="year-filter">Chọn Năm: </label>
                            <select
                                id="year-filter"
                                value={slug || ''}
                                onChange={(e) => handleYearChange(e.target.value)}
                                className="year-select"
                            >
                                <option value="">Tất Cả</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {films && films.length > 0 ? (
                        films.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => handleClickFilmDetail(item.slug)}
                                className="film-item col col-lg-2 col-md-4"
                            >
                                <div className="film-item-img-container">
                                    <img src={item.poster_url} alt={item.name} />
                                    <div className="film-item-iconplay">
                                        <FontAwesomeIcon className="fa-circle-play" icon={faCirclePlay} />
                                    </div>
                                </div>
                                <h4>{handleTruncateText(item.name)}</h4>
                            </div>
                        ))
                    ) : (
                        <div className="error-message">Không tìm thấy phim nào</div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="row pageNum-container">
                        <div className="film-pageNum-continer">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default YearFilm;