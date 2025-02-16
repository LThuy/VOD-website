import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CRow } from "@coreui/react";

import CIcon from '@coreui/icons-react'
import {
    cilPencil,
    cilTrash,
    cilPlus,
    cilLockLocked,
    cilLockUnlocked,
} from '@coreui/icons'
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminLibrary() {
    const [admins, setAdmins] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleLock, setModalVisibleLock] = useState(false);
    const [selectedAdminId, setselectedAdminId] = useState(null);

    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchadmins() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/info/admin-library`);
                setAdmins(response.data); 
                console.log(admins)
            } catch (error) {
                setError(error.message);
            }
        }
        fetchadmins();
        
    }, []);

    const toggleModalLock = (user) => {
        setselectedAdminId(user)
        setModalVisibleLock(!modalVisibleLock)
      }

    const handleEdit = (adminId) => {
        // Handle edit action (you can add the logic to edit the admin here)
        console.log('Editing admin with ID:', adminId);
        navigate(`/infor/edit-admin/${adminId}`);
    };

    const confirmDelete = (adminId) => {
        setselectedAdminId(adminId);
        setModalVisible(true);
    };
    const handleConfirmDelete = () => {
        if (selectedAdminId) {
            handleDelete(selectedAdminId._id);
            setModalVisible(false);
        }   
    };

    const handleDelete = async (adminId) => {
        console.log('Deleting admin with ID:', adminId);
        try {
            const response = await axios.delete(`${import.meta.env.VITE_SERVER_BASE_URL}/delete-admin/${adminId}`);
            if(response.status == 200) {
                setAdmins(admins.filter((admin) => admin._id !== adminId));
                toast.success(response.data.message);
            }
        } 
        catch (error) {
            // If error is thrown, show an error toast with the appropriate message
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            toast.error(errorMessage);
        }
    };

    const handleLockUnlock = async () => {
        if (selectedAdminId) {
          try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/info/users/${selectedAdminId._id}/lock`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ locked: !selectedAdminId.locked }),
            })
    
            if (!response.ok) {
              throw new Error('Failed to update user status')
            }
    
            const updatedUser = await response.json()
    
            // Update the user list with the updated user data
            setAdmins((prevUsers) =>
              prevUsers.map((user) =>
                user._id === updatedUser._id ? updatedUser : user
              )
            )
    
            toast.success(
              `${updatedUser.username} has been ${updatedUser.locked ? 'locked' : 'unlocked'}`
            )
          } catch (error) {
            toast.error('Error updating user status')
            console.error('Error:', error)
          }
        }
        setModalVisibleLock(false)
      }

    return (
        <div className="admin-container">
            <CButton
        color="success"
        size="lg"
        className="d-flex align-items-center justify-content-center ms-auto mb-3"
        onClick={() => { navigate("/forms/create-admin"); }}
        style={{ borderRadius: '50px', padding: '5px 10px' }} 
    >
        <CIcon icon={cilPlus} style={{ fontSize: '1.5rem', marginRight: '8px', color: '#ffff' }} /> 
        <div style={{ fontWeight: 'bold', color: '#ffff' }}>Add New admin</div> 
        </CButton>
            <CRow>
                <CTable align="middle" className="mb-0 border" hover responsive>
                    <CTableHead className="text-nowrap">
                        <CTableRow>
                            <CTableHeaderCell className="bg-body-tertiary">Username</CTableHeaderCell>
                            <CTableHeaderCell className="bg-body-tertiary">Email</CTableHeaderCell>
                            <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
                            <CTableHeaderCell className="bg-body-tertiary">Lock/Unlock</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {admins.map((admin) => (
                            <CTableRow key={admin._id}>
                                <CTableDataCell>

                                    <div>{admin.username}</div> 
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div>{admin.email}</div> 
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        onClick={() => handleEdit(admin._id)}
                                    >
                                    <CIcon icon={cilPencil} />
                                    </CButton>{' '}
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        onClick={() => confirmDelete(admin)}
                                    >
                                        <CIcon icon={cilTrash} />
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell>
                                <CButton
                                    color="link"
                                    onClick={() => toggleModalLock(admin)}
                                    title={admin.locked ? 'Unlock User' : 'Lock User'}
                                    >
                                    <CIcon icon={admin.locked ? cilLockLocked : cilLockUnlocked} size="xl" />
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CRow>
            {/* Confirmation Modal */}
            {selectedAdminId && (
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Confirm Deletion</CModalTitle>
                </CModalHeader>
                <CModalBody>Are you sure you want to delete this{' '}
                <strong>{selectedAdminId.username}</strong>?
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible(false)}>
                        Cancel
                    </CButton>
                    <CButton color="danger" onClick={handleConfirmDelete}>
                        Yes, Delete
                    </CButton>
                </CModalFooter>
            </CModal>
            )}

            {/* Lock/Unlock Confirmation Modal */}           
            {selectedAdminId && (
            <CModal visible={modalVisibleLock} onClose={() => setModalVisible(false)}>
            <CModalHeader>
              <CModalTitle>{selectedAdminId.locked ? 'Unlock User' : 'Lock User'}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              Are you sure you want to {selectedAdminId.locked ? 'unlock' : 'lock'}{' '}
              <strong>{selectedAdminId.username}</strong>?
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setModalVisibleLock(false)}>
                Cancel
              </CButton>
              <CButton color="primary" onClick={handleLockUnlock}>
                Confirm
              </CButton>
            </CModalFooter>
          </CModal>
      )}
        </div>
    );
}

export default AdminLibrary;
