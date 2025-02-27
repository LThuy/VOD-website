import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import "../../Style/BodyCss/Home.scss";
import "../../Style/All/grid.css";
import "../../Style/Responsive/Responsive.css";
import { useHandleClickFilmDetail } from "../../Ultil/Hepler/navigationHelpers";
import { useHandleTruncateText } from "../../Ultil/Hepler/truncateText";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function SearchResult() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [filmResult, setFilmResult] = useState([]);
  const [dataFilmResult, setDataFilmResult] = useState({});
  const handleClickFilmDetail = useHandleClickFilmDetail();
  const handleTruncateText = useHandleTruncateText();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/film/search-film?keyword=${encodeURIComponent(slug)}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const searchFilmData = await response.json();

        if (searchFilmData) {
          setDataFilmResult({
            titlePage: `Kết quả tìm kiếm: ${slug}`,
            seoOnPage: { titleHead: `Tìm kiếm - ${slug}` }
          });
          setFilmResult(searchFilmData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setFilmResult([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  useEffect(() => {
    document.title = dataFilmResult?.seoOnPage?.titleHead || "Kết quả tìm kiếm";
  }, [dataFilmResult]);

  if (loading) {
    return (
      <div>
        <div className="maincontainer-searchResult">
          <div className="grid">
            <div className="row header-container">
              <div className="film-header-container">
                <Skeleton
                  height={40}
                  width="100%"
                  baseColor="#e0e0e0"
                  highlightColor="#f5f5f5"
                />
              </div>
            </div>
            <div className="row">
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="maincontainer-searchResult">
        <div className="grid">
          <div className="row header-container">
            <div className="film-header-container">
              <h1 className="film-item_header">
                {dataFilmResult?.titlePage || "Đang tải phim"}
              </h1>
            </div>
          </div>
          <div className="row">
            {loading ? (
              <div className="loading-container">
                <div className="loading-item">
                  <FontAwesomeIcon
                    className="icon-loading"
                    icon={faSpinner}
                    spin
                    size="3x"
                  />
                  <h2 className="mt-3">Thông cảm! Đợi chút nha...</h2>
                </div>
              </div>
            ) : filmResult && filmResult.length > 0 ? (
              filmResult.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleClickFilmDetail(item.slug)}
                  className="film-item col col-lg-2 col-md-4"
                >
                  <div className="film-item-img-container">
                    <img src={item.poster_url} alt={item.name} />
                    <div className="film-item-iconplay">
                      <FontAwesomeIcon
                        className="fa-circle-play"
                        icon={faCirclePlay}
                      />
                    </div>
                  </div>
                  <h4>{handleTruncateText(item.name)}</h4>
                </div>
              ))
            ) : (
              <div className="error-message">Không tìm thấy kết quả</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResult;