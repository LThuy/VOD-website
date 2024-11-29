import React, { useState, useEffect } from "react";
import "../../Style/BodyCss/Profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCirclePlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText'

const CreateNewFilm = () => {
  const [filmData, setFilmData] = useState({
    name: '',
    slug: '',
    origin_name: '',
    content: '',
    type: '',
    status: '',
    poster_url: '',
    thumb_url: '',
    trailer_url: '',
    time: '',
    episode_current: '',
    episode_total: '',
    quality: '',
    lang: '',
    notify: '',
    showtimes: '',
    year: '',
    actor: [],
    director: [],
    category: [],
    country: [],
  });

  const handleSubmit = (e) => {
    const { name, value } = e.target;
    setFilmData({
      ...filmData,
      [name]: value,
    });
  };
  const handleChange = (e) => {

  }
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    // xử lí upload lên server ở đây
    // Make sure a file is selected
    if (files.length > 0) {
      setFilmData({
        ...filmData,
        [name]: files[0], // Save the selected file to the state (you can handle it later, e.g., upload to server)
      });
    }
  };
  

  return (
    <div className="profiledetail-section">
      <div className="profiledetail-container">
        <div className="profiledetail-container-grid">
          <div className="profiledetail-container-item">
            <div className="profiledetail-container-item_header">
              <h1>Create New Film</h1>
            </div>
            <div className="profiledetail-container-item-info">
              <form id="create-newfilm" onSubmit={handleSubmit}>
                <div className="row">
                  {/* Film Name */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Film Name:</span>
                    <input
                      name="name"
                      className="form-create-input"
                      type="text"
                      value={filmData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Slug:</span>
                    <input
                      name="slug"
                      className="form-create-input"
                      type="text"
                      value={filmData.slug}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Origin Name */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Origin Name:</span>
                    <input
                      name="origin_name"
                      className="form-create-input"
                      type="text"
                      value={filmData.origin_name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Content */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Content:</span>
                    <textarea
                      name="content"
                      className="form-create-input"
                      rows="4"
                      value={filmData.content}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Type */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Type:</span>
                    <input
                      name="type"
                      className="form-create-input"
                      type="text"
                      value={filmData.type}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Status */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Status:</span>
                    <input
                      name="status"
                      className="form-create-input"
                      type="text"
                      value={filmData.status}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Poster URL */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Poster URL:</span>
                    <input
                      name="poster_url"
                      className="form-create-input"
                      type="text"
                      value={filmData.poster_url}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Thumbnail URL */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Thumbnail URL:</span>
                    <input
                      name="thumb_url"
                      className="form-create-input"
                      type="text"
                      value={filmData.thumb_url}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Trailer URL */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Trailer URL:</span>
                    <input
                      name="trailer_url"
                      className="form-create-input"
                      type="text"
                      value={filmData.trailer_url}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Time */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Time (e.g., 131 minutes):</span>
                    <input
                      name="time"
                      className="form-create-input"
                      type="text"
                      value={filmData.time}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Episode Current */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Episode Current:</span>
                    <input
                      name="episode_current"
                      className="form-create-input"
                      type="text"
                      value={filmData.episode_current}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Episode Total */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Episode Total:</span>
                    <input
                      name="episode_total"
                      className="form-create-input"
                      type="text"
                      value={filmData.episode_total}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Quality */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Quality:</span>
                    <input
                      name="quality"
                      className="form-create-input"
                      type="text"
                      value={filmData.quality}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Language */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Language:</span>
                    <input
                      name="lang"
                      className="form-create-input"
                      type="text"
                      value={filmData.lang}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Notify */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Notify:</span>
                    <input
                      name="notify"
                      className="form-create-input"
                      type="text"
                      value={filmData.notify}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Showtimes */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Showtimes:</span>
                    <input
                      name="showtimes"
                      className="form-create-input"
                      type="text"
                      value={filmData.showtimes}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Year */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Year:</span>
                    <input
                      name="year"
                      className="form-create-input"
                      type="number"
                      value={filmData.year}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Actors */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Actors:</span>
                    <input
                      name="actor"
                      className="form-create-input"
                      type="text"
                      value={filmData.actor}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Directors */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Directors:</span>
                    <input
                      name="director"
                      className="form-create-input"
                      type="text"
                      value={filmData.director}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Categories */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Categories:</span>
                    <input
                      name="category"
                      className="form-create-input"
                      type="text"
                      value={filmData.category}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Countries */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Countries:</span>
                    <input
                      name="country"
                      className="form-create-input"
                      type="text"
                      value={filmData.country}
                      onChange={handleChange}
                    />
                  </div>
                  {/* upload file */}
                  {/* File Upload for MP4 */}
                  <div className="form-create-group col-xl-6 col-lg-6 col-md-4 col-sm-4 col-12">
                    <span>Upload MP4 File:</span>
                    <input
                      name="videoFile"
                      className="form-create-input"
                      type="file"
                      accept="video/mp4" 
                      onChange={handleFileChange}
                    />
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CreateNewFilm;
