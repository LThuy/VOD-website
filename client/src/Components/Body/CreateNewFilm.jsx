
import React, { useState, useEffect } from "react";
import "../../Style/BodyCss/Profile.css";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCirclePlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText'

const CreateNewFilm = () => {
  const [file, setFile] = useState(null);
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

   // Create a FormData object
   const formData = new FormData();

   // Append the file
   formData.append('video', file);
   formData.append('name', filmData.name);

  // Append all fields dynamically
  // for (const key in filmData) {
  //   if (Array.isArray(filmData[key])) {
  //     // If the field is an array, append each element separately
  //     filmData[key].forEach((item, index) => {
  //       formData.append(`${key}[${index}]`, item);
  //     });
  //   } else {
  //     // Append scalar values directly
  //     formData.append(key, filmData[key]);
  //   }
  // }

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // const { name, value } = e.target;
    // setFilmData({
    //   ...filmData,
    //   [name]: value,
    // });

    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
        body: formData, 
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Upload failed");
      }

      const result = await response.json();

      // Show success toast
      toast.success(result.message || 'Upload Successfully!');
      console.log(result)

      // Navigate to the home page after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'An error occurred during upload.');
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilmData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  const handleFileChange = (e) => {
    // const { name, files } = e.target;
    // xử lí upload lên server ở đây
    // Make sure a file is selected
    // if (files.length > 0) {
    //   setFilmData({
    //     ...filmData,
    //     [name]: files[0], // Save the selected file to the state (you can handle it later, e.g., upload to server)
    //   });
    // }
    setFile(e.target.files[0]);
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
                <div className="form-row-container">
                  {/* Film Name */}
                  <div className="form-group">
                    <label>Film Name:</label>
                    <input
                      className="form-control-create"
                      name="name"
                      type="text"
                      value={filmData.name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div className="form-group">
                    <label>Slug:</label>
                    <input
                      className="form-control-create"
                      name="slug"
                      type="text"
                      value={filmData.slug || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Origin Name */}
                  <div className="form-group">
                    <label>Origin Name:</label>
                    <input
                      className="form-control-create"
                      name="origin_name"
                      type="text"
                      value={filmData.origin_name || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Content */}
                  <div className="form-group full-width">
                    <label>Content:</label>
                    <textarea
                      name="content"
                      rows="2"
                      value={filmData.content || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Type */}
                  <div className="form-group">
                    <label>Type:</label>
                    <input
                      className="form-control-create"
                      name="type"
                      type="text"
                      value={filmData.type || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Status */}
                  <div className="form-group">
                    <label>Status:</label>
                    <input
                      className="form-control-create"
                      name="status"
                      type="text"
                      value={filmData.status || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Poster URL */}
                  <div className="form-group">
                    <label>Poster URL:</label>
                    <input
                      className="form-control-create"
                      name="poster_url"
                      type="text"
                      value={filmData.poster_url || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Thumbnail URL */}
                  <div className="form-group">
                    <label>Thumbnail URL:</label>
                    <input
                      className="form-control-create"
                      name="thumb_url"
                      type="text"
                      value={filmData.thumb_url || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Trailer URL */}
                  <div className="form-group">
                    <label>Trailer URL:</label>
                    <input
                      className="form-control-create"
                      name="trailer_url"
                      type="text"
                      value={filmData.trailer_url || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Time */}
                  <div className="form-group">
                    <label>Time (e.g., 131 minutes):</label>
                    <input
                      className="form-control-create"
                      name="time"
                      type="text"
                      value={filmData.time || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Episode Current */}
                  <div className="form-group">
                    <label>Episode Current:</label>
                    <input
                      className="form-control-create"
                      name="episode_current"
                      type="text"
                      value={filmData.episode_current || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Episode Total */}
                  <div className="form-group">
                    <label>Episode Total:</label>
                    <input
                      className="form-control-create"
                      name="episode_total"
                      type="text"
                      value={filmData.episode_total || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Quality */}
                  <div className="form-group">
                    <label>Quality:</label>
                    <input
                      className="form-control-create"
                      name="quality"
                      type="text"
                      value={filmData.quality || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Language */}
                  <div className="form-group">
                    <label>Language:</label>
                    <input
                      className="form-control-create"
                      name="lang"
                      type="text"
                      value={filmData.lang || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Notify */}
                  <div className="form-group">
                    <label>Notify:</label>
                    <input
                      className="form-control-create"
                      name="notify"
                      type="text"
                      value={filmData.notify || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Showtimes */}
                  <div className="form-group">
                    <label>Showtimes:</label>
                    <input
                      className="form-control-create"
                      name="showtimes"
                      type="text"
                      value={filmData.showtimes || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Year */}
                  <div className="form-group">
                    <label>Year:</label>
                    <input
                      className="form-control-create"
                      name="year"
                      type="number"
                      value={filmData.year || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Actors */}
                  <div className="form-group">
                    <label>Actors:</label>
                    <input
                      className="form-control-create"
                      name="actor"
                      type="text"
                      value={filmData.actor || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Directors */}
                  <div className="form-group">
                    <label>Directors:</label>
                    <input
                      className="form-control-create-create"
                      name="director"
                      type="text"
                      value={filmData.director || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Categories */}
                  <div className="form-group">
                    <label>Categories:</label>
                    <input
                      className="form-control-create"
                      name="category"
                      type="text"
                      value={filmData.category || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Countries */}
                  <div className="form-group">
                    <label>Countries:</label>
                    <input
                      className="form-control-create"
                      name="country"
                      type="text"
                      value={filmData.country || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Upload File */}
                  <div className="form-group full-width">
                    <label>Upload MP4 File:</label>
                    <input
                      className="form-control-create"
                      name="video"
                      type="file"
                      accept="video/mp4"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <button type="submit" className="bg-primary text-white p-2 border rounded mt-3">Upload</button>
              </form>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};


export default CreateNewFilm;
