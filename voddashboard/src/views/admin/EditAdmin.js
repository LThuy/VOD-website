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

function EditAdmin() {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function fetchAdmin() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/info/admin-library/edit/${adminId}`);
        setAdminData(response.data.admin);
      } catch (error) {
        console.error('Error fetching film data:', error);
        toast.error('Error fetching film data');
      }
    }

    fetchAdmin();
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

  
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_BASE_URL}/info/update-admin/${adminId}`,
        adminData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
  
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate('/infor/admin-library');
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error('Error updating admin');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Update This Admin</strong>
            </CCardHeader>
            <CCardBody>
              <CForm id="create-newfilm" onSubmit={handleSubmit}>
                {/* Form Fields */}
                <div className="mb-3">
                  <CFormLabel>Username:</CFormLabel>
                  <CFormInput
                    name="username"
                    type="text"
                    value={adminData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel>Email:</CFormLabel>
                  <CFormInput
                    name="email"
                    type="text"
                    value={adminData.email}
                    onChange={handleChange}
                    required
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

export default EditAdmin;
