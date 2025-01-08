import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
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
    status: '',
    // poster_url: '',
    // thumb_url: '',
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
  })
  

  // Create a FormData object
  const formData = new FormData()

  // Append the file
  formData.append('video', file)
  formData.append('poster_url', filePoster)
  formData.append('thumb_url', fileThumb)
  formData.append('name', filmData.name)
  formData.append('slug', filmData.slug)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilmData({ ...filmData, [name]: value })
  }

  const handleFileChange = (e) => {
    // setFilmData({ ...filmData, video: e.target.files[0] });
    setFile(e.target.files[0])
  }

  const handleThumbChange = (e) => {
    // setFilmData({ ...filmData, video: e.target.files[0] });
    setFileThumb(e.target.files[0])
  }

  const handlePosterChange = (e) => {
    // setFilmData({ ...filmData, video: e.target.files[0] });
    setFilePoster(e.target.files[0])
  }

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log('Form Submitted:', formData)
    // Add your API or form submission logic here
    // try {
    //   const response = await fetch('http://localhost:5000/upload', {
    //       method: 'POST',
    //       // headers: {
    //       //   'Content-Type': 'multipart/form-data',
    //       // },
    //       body: formData,
    //   });

    //   if (!response.ok) {
    //       const errorResponse = await response.json();
    //       throw new Error(errorResponse.message || "Upload failed");
    //   }

    //   const result = await response.json();

    //   // Show success toast
    //   toast.success('Upload Successfully!', {
    //     icon: '🚀', 
    //   })
    //   // console.log(result) 

    //   // Navigate to the home page after a delay
    //   // setTimeout(() => {
    //   // navigate('/');
    //   // }, 2000);
    // } catch (error) {
    //   console.error('Upload error:', error)
    //   toast.error(error.message || 'An error occurred during upload.')
    // }
    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setProgress(percentCompleted) // Update progress state
        },
      })

      if (response.status === 200) {
        toast.success('Upload Successfully!', { icon: '🚀' })
        setTimeout(() => navigate('/'), 2000) // Navigate after success
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'An error occurred during upload.')
    } finally {
      setLoading(false) // Re-enable the button
    }
  }

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Create New Film</strong>
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
