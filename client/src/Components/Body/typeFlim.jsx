import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import '../../Style/BodyCss/Home.css'
import '../../Style/All/grid.css'
import '../../Style/Responsive/Responsive.css'
import fetchingApiData from '../../Ultil/FetchingData/FetchingApi'
import Pagination from '../Pagination/Pagination';
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function TypeFilm() {
    const { slug } = useParams();
    const [film, setFilm] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataFilm, setDataFilm] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [isNew, setIsNew] = useState(true);
    const totalPages = 30;
    const imgUrl = 'https://img.phimapi.com/'
    const hanldeClickFilmDetail = useHandleClickFilmDetail();
    const hanldeTruncateText = useHandleTruncateText()

    // const [movies, setMovies] = useState([]);

    // // Fetch data from the server
    // useEffect(() => {
    //     axios.get('http://localhost:5000/danh-sach/phim-le')
    //         .then(response => {
    //             setMovies(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //         });
    // }, []);
    useEffect(() => {
        if (slug !== "phim-moi-cap-nhat") {
            setIsNew(false)
        }
        const fetchData = async () => {
            setLoading(true)
            try {
                const baseUrl = isNew ? '' : 'v1/api/'; // Conditional URL part based on isNew
                const url = `https://phimapi.com/${baseUrl}danh-sach/${slug}?limit=12&page=${currentPage}`;

                const [phimData] = await fetchingApiData([url]);
                if (phimData) {
                    // Always set the full data
                    if (isNew) {
                        // If isNew is true, we don't need phimData.data.items
                        setFilm(phimData.items);
                    } else {
                        setDataFilm(phimData.data);
                        setFilm(phimData.data.items);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, [slug, currentPage, isNew])


    //mongo version
    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true)
    //         try {
    //             const [phimData] = await fetchingApiData([
    //                 `http://localhost:5000/api/danh-sach/${slug}`, //?limit=12&page=${currentPage}
    //             ]);
    //             console.log(phimData[0])
    //             if (phimData[0] && phimData[0].data.items) {
    //                 setDataFilm(phimData[0].data);
    //                 setFilm(phimData[0].data.items);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         } finally {
    //             setLoading(false)
    //         }
    //     };

    //     fetchData();
    // },[slug,currentPage])

    useEffect(() => {
        document.title = dataFilm?.seoOnPage?.titlePage || 'Phim Bộ';
    }, [dataFilm]);

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
            <div className="maincontainer">
                <div className="grid">
                    <div className="row header-container">
                        <div className="film-header-container">
                            <h1 className="film-item_header">{dataFilm?.seoOnPage?.titleHead || (isNew ? "Phim mới cập nhật" : "Đang tải phim")}</h1>
                        </div>
                    </div>
                    <div className='row'>
                        {film && film.length > 0 ? (
                            film.map(item => (
                                <div key={item._id} onClick={() => hanldeClickFilmDetail(item.slug)} className="film-item col col-lg-2 col-md-4">
                                    <div className="film-item-img-container">
                                        <img
                                            src={isNew ? item.poster_url : imgUrl + item.poster_url}
                                            alt={item.name}
                                        />
                                    </div>
                                    <div className="film-item-iconplay">
                                        <FontAwesomeIcon className='fa-circle-play' icon={faCirclePlay} />
                                    </div>
                                    <h4>{hanldeTruncateText(item.name)}</h4>
                                </div>
                            ))
                        ) : (
                            // If no films are available, show skeleton placeholders
                            [...Array(12)].map((_, index) => (
                                <div key={index} className="film-item col col-lg-2 col-md-4">
                                    <div className="film-item-img-container">
                                        <Skeleton height={270} width="100%" />
                                    </div>
                                    <div className="film-item-iconplay">
                                        <Skeleton circle width={30} height={30} />
                                    </div>
                                    <Skeleton width="80%" height={20} />
                                </div>
                            ))
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
    )
}

export default TypeFilm