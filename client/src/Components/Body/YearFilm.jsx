import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import '../../Style/BodyCss/Home.css';
import '../../Style/All/grid.css';
import '../../Style/Responsive/Responsive.css';
import fetchingApiData from '../../Ultil/FetchingData/FetchingApi';
import Pagination from '../Pagination/Pagination';
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function YearFilm() {
    const { slug } = useParams();
    const [films, setFilms] = useState([]);
    const [filteredFilm, setFilteredFilms] = useState([]);
    const [selectedYear, setSelectedYear] = useState(""); // State for selected year
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 30;
    const imgUrl = 'https://img.phimapi.com/';
    const hanldeClickFilmDetail = useHandleClickFilmDetail();
    const hanldeTruncateText = useHandleTruncateText();


    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setLoading(true);
            try {
                const [phimLeData, phimBoData] = await fetchingApiData([
                    `https://phimapi.com/v1/api/danh-sach/phim-le?limit=60&page=${currentPage}`,
                    `https://phimapi.com/v1/api/danh-sach/phim-bo?limit=60&page=${currentPage}`,
                ]);
                const combinedFilms = [
                    ...(phimLeData?.data.items || []),
                    ...(phimBoData?.data.items || []),
                ];
                setFilms(combinedFilms);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        setSelectedYear(parseInt(slug, 10))
        fetchData();
    }, [slug, currentPage]);

    useEffect(() => {
        // Filter by year if a year is selected
        const filteredFilms = selectedYear
            ? films.filter((item) => item.year === parseInt(selectedYear, 10)) // Filter by year
            : films; // Show all films if no year is selected
    
        setFilteredFilms(filteredFilms);
    }, [films, selectedYear]);

    useEffect(() => {
        document.title = "Năm " + selectedYear || '';
    }, [selectedYear]);

    const handleYearChange = (year) => {
        setSelectedYear(year);
        setCurrentPage(1); 
    };

    if (loading) {
        return (
            <div>
                <div className="maincontainer">
                    <div className="grid">
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
                        <div className="row pageNum-container">
                            <div className="film-pageNum-continer">
                                <Skeleton height={40} width={500} baseColor="#e0e0e0" highlightColor="#f5f5f5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="maincontainer">
                <div className="grid">
                    {/* Dropdown for Year Selection */}
                    <div className="row header-container">
                        <div className="film-header-container">
                            <h1 className="film-item_header">{`PHIM HAY NĂM ${selectedYear} - TRANG ${currentPage}`}</h1>
                            <div>
                                <label htmlFor="year-filter">Filter by Year: </label>
                                <select
                                    id="year-filter"
                                    value={selectedYear}
                                    onChange={(e) => handleYearChange(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    {/* Add more years dynamically or hardcode */}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        {filteredFilm && filteredFilm.length > 0 ? (
                            filteredFilm.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => hanldeClickFilmDetail(item.slug)}
                                    className="film-item col col-lg-2 col-md-4"
                                >
                                    <div className="film-item-img-container">
                                        <img src={imgUrl + item.poster_url} alt={item.name} />
                                    </div>
                                    <div className="film-item-iconplay">
                                        <FontAwesomeIcon className='fa-circle-play' icon={faCirclePlay} />
                                    </div>
                                    <h4>{hanldeTruncateText(item.name)}</h4>
                                </div>
                            ))
                        ) : (
                            <div className="error-message">No results found</div>
                        )}
                    </div>

                    <div className="row pageNum-container">
                        <div className="film-pageNum-continer">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default YearFilm;
