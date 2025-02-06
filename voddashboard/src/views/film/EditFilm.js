import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from '@coreui/react';

function EditFilm() {
  const { filmId } = useParams();
  const navigate = useNavigate();
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
    comments: [],
    episodes: []
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    async function fetchFilm() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/film/get-film/${filmId}`);
        setFilmData(response.data.data);
      } catch (error) {
        console.error('Error fetching film data:', error);
        toast.error('Error fetching film data');
      }
    }

    fetchFilm();
  }, [filmId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilmData({ ...filmData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    // Append film data fields to formData
    console.log('filmData:', filmData);


    Object.keys(filmData).forEach((key) => {
    if (Array.isArray(filmData[key])) {
      // This will handle all array fields (category, country, actor, director, comments)
      formData.append(key, JSON.stringify(filmData[key]));
    } else {
      formData.append(key, filmData[key]);
    }
  });

    if (file) {
      formData.append('video', file);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_BASE_URL}/film/update-film/${filmId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate('/film/manage-library'); 
      }
    } catch (error) {
      console.error('Error updating film:', error);
      toast.error('Error updating film');
    } finally {
      setLoading(false);
    }
  };

  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    // Create a Set to ensure unique country names
    const uniqueCountries = new Set();
    const uniqueCategories = new Set();
  
    // Add country names to the Set
    filmData.country.forEach((country) => {
      uniqueCountries.add(country.name);
    });

    filmData.category.forEach((cate) => {
      uniqueCategories.add(cate.name);
    });
  
    // Convert the Set back to an array and update the state
    setCountries(Array.from(uniqueCountries));
    setCategories(Array.from(uniqueCategories));
  }, [filmData.country,filmData.category]); 




  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Update This Film</strong>
            </CCardHeader>
            <CCardBody>
              <CForm id="create-newfilm" onSubmit={handleSubmit}>
                {/* Form Fields */}
                <div className="mb-3">
                  <CFormLabel>Film Name:</CFormLabel>
                  <CFormInput
                    name="name"
                    type="text"
                    value={filmData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel>Slug:</CFormLabel>
                  <CFormInput
                    name="slug"
                    type="text"
                    value={filmData.slug}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Origin Name */}
                <div className="mb-3">
                    <CFormLabel>Origin Name:</CFormLabel>
                    <CFormInput
                    name="origin_name"
                    type="text"
                    value={filmData.origin_name}
                    onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                  <CFormLabel>Content:</CFormLabel>
                  <CFormTextarea
                    name="content"
                    rows={7}
                    value={filmData.content}
                    onChange={handleChange}
                  />
                </div>
                {/* Type */}
                <div className="mb-3">
                    <CFormLabel>Type:</CFormLabel>
                    <CFormInput
                    name="type"
                    type="text"
                    value={filmData.type}
                    onChange={handleChange}
                    />
                </div>

                {/* Status */}
                <div className="mb-3">
                    <CFormLabel>Status:</CFormLabel>
                    <CFormInput
                    name="status"
                    type="text"
                    value={filmData.status}
                    onChange={handleChange}
                    />
                </div>

                {/* Poster URL */}
                <div className="mb-3">
                    <CFormLabel>Poster URL:</CFormLabel>
                    <CFormInput
                    name="poster_url"
                    type="text"
                    value={filmData.poster_url}
                    onChange={handleChange}
                    />
                </div>

                {/* Thumbnail URL */}
                <div className="mb-3">
                    <CFormLabel>Thumbnail URL:</CFormLabel>
                    <CFormInput
                    name="thumb_url"
                    type="text"
                    value={filmData.thumb_url}
                    onChange={handleChange}
                    />
                </div>

                {/* Trailer URL */}
                <div className="mb-3">
                    <CFormLabel>Trailer URL:</CFormLabel>
                    <CFormInput
                    name="trailer_url"
                    type="text"
                    value={filmData.trailer_url}
                    onChange={handleChange}
                    />
                </div>

                {/* Time */}
                <div className="mb-3">
                    <CFormLabel>Time (e.g., 131 minutes):</CFormLabel>
                    <CFormInput
                    name="time"
                    type="text"
                    value={filmData.time}
                    onChange={handleChange}
                    />
                </div>

                {/* Episode Current */}
                <div className="mb-3">
                    <CFormLabel>Episode Current:</CFormLabel>
                    <CFormInput
                    name="episode_current"
                    type="text"
                    value={filmData.episode_current}
                    onChange={handleChange}
                    />
                </div>

                {/* Episode Total */}
                <div className="mb-3">
                    <CFormLabel>Episode Total:</CFormLabel>
                    <CFormInput
                    name="episode_total"
                    type="text"
                    value={filmData.episode_total}
                    onChange={handleChange}
                    />
                </div>

                {/* Quality */}
                <div className="mb-3">
                    <CFormLabel>Quality:</CFormLabel>
                    <CFormInput
                    name="quality"
                    type="text"
                    value={filmData.quality}
                    onChange={handleChange}
                    />
                </div>

                {/* Language */}
                <div className="mb-3">
                    <CFormLabel>Language:</CFormLabel>
                    <CFormInput
                    name="lang"
                    type="text"
                    value={filmData.lang}
                    onChange={handleChange}
                    />
                </div>

                {/* Notify */}
                <div className="mb-3">
                    <CFormLabel>Notify:</CFormLabel>
                    <CFormInput
                    name="notify"
                    type="text"
                    value={filmData.notify}
                    onChange={handleChange}
                    />
                </div>

                {/* Showtimes */}
                <div className="mb-3">
                    <CFormLabel>Showtimes:</CFormLabel>
                    <CFormInput
                    name="showtimes"
                    type="text"
                    value={filmData.showtimes}
                    onChange={handleChange}
                    />
                </div>

                {/* Year */}
                <div className="mb-3">
                    <CFormLabel>Year:</CFormLabel>
                    <CFormInput
                    name="year"
                    type="number"
                    value={filmData.year}
                    onChange={handleChange}
                    />
                </div>

                {/* Actors */}
                <div className="mb-3">
                    <CFormLabel>Actors:</CFormLabel>
                    <CFormInput
                    name="actor"
                    type="text"
                    value={filmData.actor}
                    onChange={handleChange}
                    />
                </div>

                {/* Directors */}
                <div className="mb-3">
                    <CFormLabel>Directors:</CFormLabel>
                    <CFormInput
                    name="director"
                    type="text"
                    value={filmData.director}
                    onChange={handleChange}
                    />
                </div>

                {/* Categories */}
                <div className="mb-3">
                    <CFormLabel>Categories:</CFormLabel>
                    <CFormInput
                    name="category"
                    type="text"
                    value={categories.join(',')}
                    onChange={handleChange}
                    />
                </div>

                {/* Countries */}
                <div className="mb-3">
                    <CFormLabel>Countries:</CFormLabel>
                    <CFormInput
                    name="country"
                    type="text"
                    value={countries.join(", ")}
                    onChange={handleChange}
                    />
                </div>

                {/* File Upload */}
                <div className="mb-3">
                  <CFormLabel>Upload MP4 File:</CFormLabel>
                  <CFormInput
                    name="video"
                    type="file"
                    accept="video/mp4"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Submit Button */}
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update'}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
}

export default EditFilm;
