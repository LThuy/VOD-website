import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
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
  CProgress,
  CProgressBar,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import axios from 'axios'

function CreateFilm() {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [fileThumb, setFileThumb] = useState(null)
  const [filePoster, setFilePoster] = useState(null)
  const [filmData, setFilmData] = useState({
    name: '',
    slug: '',
    origin_name: '',
    content: '',
    type: '',
    trailer_url: '',
    time: '',
    episode_current: '',
    episode_total: '',
    quality: '',
    lang: '',
    notify: '',
    showtimes: '',
    year: '',
    actor:[],
    director: [],
    category: [],
    country: [],
  })
  
  // Load saved form data from localStorage when component mounts
  useEffect(() => {
    const savedFormData = localStorage.getItem('filmFormData');
    if (savedFormData) {
      setFilmData(JSON.parse(savedFormData));
    }
  }, []);

  const formData = new FormData();

  // Append files separately if they exist
  if (file) formData.append('video', file);
  if (filePoster) formData.append('poster_url', filePoster);
  if (fileThumb) formData.append('thumb_url', fileThumb);

  // Append all other properties of filmData
  Object.entries(filmData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedFilmData = { ...filmData, [name]: value };
    setFilmData(updatedFilmData);
    
    // Save to localStorage whenever form data changes
    localStorage.setItem('filmFormData', JSON.stringify(updatedFilmData));
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleThumbChange = (e) => {
    setFileThumb(e.target.files[0])
  }

  const handlePosterChange = (e) => {
    setFilePoster(e.target.files[0])
  }

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log('Form Submitted:', formData)
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setProgress(percentCompleted) // Update progress state
        },
      })

      if (response.status === 200) {
        // Clear the saved form data on successful submission
        localStorage.removeItem('filmFormData');
        toast.success('Upload Successfully!', { icon: '🚀' })
        setTimeout(() => navigate('/film/manage-library'), 2000) // Navigate after success
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'An error occurred during upload.')
    } finally {
      setLoading(false) // Re-enable the button
    }
  }

  // Function to clear cached form data
  const clearFormCache = () => {
    localStorage.removeItem('filmFormData');
    setFilmData({
      name: '',
      slug: '',
      origin_name: '',
      content: '',
      type: '',
      trailer_url: '',
      time: '',
      episode_current: '',
      episode_total: '',
      quality: '',
      lang: '',
      notify: '',
      showtimes: '',
      year: '',
      actor:[],
      director: [],
      category: [],
      country: [],
    });
    toast.info('Form data cleared!');
  }

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className='d-flex justify-content-between align-items-center'>
              <strong>Create New Film</strong>
              <CButton 
                color="danger"
                className="px-3 py-2"
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
                onClick={clearFormCache}
              >
                Clear Form
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CForm id="create-newfilm" onSubmit={handleSubmit}>
                {/* Film Name */}
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

                {/* Slug */}
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

                {/* Content */}
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

                {/* Poster URL */}
                <div className="mb-3">
                  <CFormLabel>Poster URL:</CFormLabel>
                  <CFormInput
                    name="poster_url"
                    type="file"
                    onChange={handlePosterChange}
                  />
                </div>

                {/* Thumbnail URL */}
                <div className="mb-3">
                  <CFormLabel>Thumbnail URL:</CFormLabel>
                  <CFormInput
                    name="thumb_url"
                    type="file"
                    onChange={handleThumbChange}
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
                    value={filmData.category}
                    onChange={handleChange}
                  />
                </div>

                {/* Countries */}
                <div className="mb-3">
                  <CFormLabel>Countries:</CFormLabel>
                  <CFormInput
                    name="country"
                    type="text"
                    value={filmData.country}
                    onChange={handleChange}
                  />
                </div>

                {/* Upload File */}
                <div className="mb-3">
                  <CFormLabel>Upload MP4 File:</CFormLabel>
                  <CFormInput
                    name="video"
                    type="file"
                    accept="video/mp4"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Progress Bar */}
                {progress > 0 && (
                  <CProgress className="mb-3">
                    <CProgressBar value={progress}>
                      {progress}%
                    </CProgressBar>
                  </CProgress>
                )}

                {/* Upload Button */}
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? 'Uploading...' : 'Upload'}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default CreateFilm