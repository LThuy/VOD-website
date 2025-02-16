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
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "" })

  // Validate inputs
    const validateInput = () => {
      const { email } = formData;
  
      if (!email.trim()) {
        toast.error("Email is required.");
        return false;
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Invalid email format.");
        return false;
      }
  
      return true;
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateInput()) {
        return;
    }
    setLoading(true)
    console.log('Form Submitted:', formData)
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/create-admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || "Create failed");
        }
  
        const result = await response.json();
  
        toast.success(result.message || "Login successful!");
    } catch (error) {
      console.error('Create error:', error)
      toast.error(error.response?.data?.message || 'An error occurred during create.')
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
              <strong>Create New Admin</strong>
            </CCardHeader>
            <CCardBody>
              <CForm id="create-newadmin" onSubmit={handleSubmit}>
                {/* Film Name */}
                <div className="mb-3">
                  <CFormLabel>Admin Email:</CFormLabel>
                  <CFormInput
                    name="email"
                    type="text"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Slug */}
                {/* <div className="mb-3">
                  <CFormLabel>Slug:</CFormLabel>
                  <CFormInput
                    name="slug"
                    type="text"
                    value={filmData.slug}
                    onChange={handleChange}
                    required
                  />
                </div> */}

                {/* Origin Name */}
                {/* <div className="mb-3">
                  <CFormLabel>Origin Name:</CFormLabel>
                  <CFormInput
                    name="origin_name"
                    type="text"
                    value={filmData.origin_name}
                    onChange={handleChange}
                  />
                </div> */}


                {/* Upload Button */}
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? 'Processing...' : 'Create'}
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
