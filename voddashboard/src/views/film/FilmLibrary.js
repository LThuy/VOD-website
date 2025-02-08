import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CRow } from "@coreui/react";

import CIcon from '@coreui/icons-react'
import {
    cilPencil,
    cilTrash,
    cilPlus
} from '@coreui/icons'
import axios from 'axios';
import { toast } from 'react-toastify';

function FilmLibrary() {
    const [films, setFilms] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFilmId, setSelectedFilmId] = useState(null);

    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchFilms() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/film/get-film`);
                setFilms(response.data.data); 
            } catch (error) {
                setError(error.message);
            }
        }

        fetchFilms();
        
    }, []);

    const handleEdit = (filmId) => {
        // Handle edit action (you can add the logic to edit the film here)
        console.log('Editing film with ID:', filmId);
        navigate(`/film/edit-film/${filmId}`);
    };
    const confirmDelete = (filmId) => {
        setSelectedFilmId(filmId);
        setModalVisible(true);
    };
    const handleConfirmDelete = () => {
        if (selectedFilmId) {
            handleDelete(selectedFilmId);
            setModalVisible(false);
        }   
    };

    const handleDelete = async (filmId) => {
        console.log('Deleting film with ID:', filmId);
        try {
            const response = await axios.delete(`${import.meta.env.VITE_SERVER_BASE_URL}/film/delete-film/${filmId}`);
            if(response.status == 200) {
                setFilms(films.filter((film) => film._id !== filmId));
                toast.success(response.data.message);
            }
        } 
        catch (error) {
            // If error is thrown, show an error toast with the appropriate message
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="film-container">
            <CButton
        color="success"
        size="lg"
        className="d-flex align-items-center justify-content-center ms-auto mb-3"
        onClick={() => { navigate("/forms/create-film"); }}
        style={{ borderRadius: '50px', padding: '5px 10px' }} 
    >
        <CIcon icon={cilPlus} style={{ fontSize: '1.5rem', marginRight: '8px' }} /> 
        <div style={{ fontWeight: 'bold' }}>Add New Film</div> 
        </CButton>
            <CRow>
                <CTable align="middle" className="mb-0 border" hover responsive>
                    <CTableHead className="text-nowrap">
                        <CTableRow>
                            <CTableHeaderCell className="bg-body-tertiary">Type</CTableHeaderCell>
                            <CTableHeaderCell className="bg-body-tertiary">Name</CTableHeaderCell>
                            <CTableHeaderCell className="bg-body-tertiary">Year</CTableHeaderCell>
                            <CTableHeaderCell className="bg-body-tertiary">Director</CTableHeaderCell>
                            <CTableHeaderCell className="bg-body-tertiary">Country</CTableHeaderCell>
                            <CTableHeaderCell className="bg-body-tertiary">Views</CTableHeaderCell>
                            <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {films.map((film) => (
                            <CTableRow key={film._id}>
                                <CTableDataCell>

                                    <div>{film.type}</div> 
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div>{film.name}</div> 
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div>{film.year}</div> 
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div>{film.director}</div> 
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div>{film.country[0].name}</div> 
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div>{film.view}</div> 
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        onClick={() => handleEdit(film._id)}
                                    >
                                        <CIcon icon={cilPencil} />
                                    </CButton>{' '}
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        onClick={() => confirmDelete(film._id)}
                                    >
                                        <CIcon icon={cilTrash} />
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CRow>
            {/* Confirmation Modal */}
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Confirm Deletion</CModalTitle>
                </CModalHeader>
                <CModalBody>Are you sure you want to delete this film?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible(false)}>
                        Cancel
                    </CButton>
                    <CButton color="danger" onClick={handleConfirmDelete}>
                        Yes, Delete
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
}

export default FilmLibrary;
