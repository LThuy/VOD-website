import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import '../../Style/BodyCss/Home.scss'
import '../../Style/All/grid.css'
import '../../Style/Responsive/Responsive.css'
import fetchingApiData from '../../Ultil/FetchingData/FetchingApi'
import Pagination from '../Pagination/Pagination';
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function CountryFilm() {
    const { slug } = useParams();
    const [films, setFilms] = useState([]);
    const [filteredFilm, setFilteredFilms] = useState([]);
    const [titleGenre, setTitleGenre] = useState([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 30;
    const imgUrl = 'https://img.phimapi.com/'
    const hanldeClickFilmDetail = useHandleClickFilmDetail();
    const hanldeTruncateText = useHandleTruncateText()

    const specialCountry = {
        "viet-nam": "VIỆT NAM",
        "au-my": "ÂU MỸ",
        "trung-quoc": "TRUNG QUỐC",
        "han-quoc": "HÀN QUỐC",
        "nhat-ban": "NHẬT BẢN",
        "an-do": "ẤN ĐỘ",
        "anh": "ANH",
        "phap": "PHÁP",
        "duc": "ĐỨC",
        "nga": "NGA",
        "y": "Ý",
        "tay-ban-nha": "TÂY BAN NHA",
        "thai-lan": "THÁI LAN",
        "philippines": "PHILIPPINES",
        "uc": "ÚC",
        "canada": "CANADA",
        "brazil": "BRAZIL"
    };
    
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setLoading(true)
            try {
                const [phimLeData, phimBoData] = await fetchingApiData([
                    `https://phimapi.com/v1/api/danh-sach/phim-le?limit=50&page=${currentPage}`,
                    `https://phimapi.com/v1/api/danh-sach/phim-bo?limit=50&page=${currentPage}`,
                ]);
                const combinedFilms = [
                    ...(phimLeData?.data.items || []),
                    ...(phimBoData?.data.items || [])
                ];
                setFilms(combinedFilms);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false)
            }
        };

        setTitleGenre(specialCountry[slug])
        fetchData();
    }, [slug, currentPage])

    useEffect(() => {
        const filteredFilms = films.filter(item =>
            item.country.some(country => slug.includes(country.slug))
        );

        setFilteredFilms(filteredFilms);
    }, [films, slug])

    useEffect(() => {
        document.title = titleGenre || '';
    }, [titleGenre]);

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
        )
    }



    return (
        <div>
            <div class="maincontainer">
                <div class="grid">
                    <div class="row header-container">
                        <div class="film-header-container">
                            <h1 class="film-item_header">{`${titleGenre} - TRANG ${currentPage}`}</h1>
                        </div>
                    </div>
                    <div className='row'>{(
                        // Check if filteredFilm has items
                        filteredFilm && filteredFilm.length > 0 ? (
                            filteredFilm.map(item => (
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
                            // Render a "No results found" message if filteredFilm is empty
                            <div className="error-message">No results found</div>
                        )
                    )}
                    </div>
                    <div class="row pageNum-container">
                        <div class="film-pageNum-continer">
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
    )
}

export default CountryFilm