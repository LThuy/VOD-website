import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Components/Partials/Header'
import Footer from './Components/Partials/Footer'
import Home from './Components/Body/Home'
import TypeFilm from './Components/Body/typeFlim'
import FilmDetail from './Components/Body/FilmDetail'
import WatchFilm from './Components/Body/WatchFilm'
import SearchResult from './Components/Body/SearchResult'
import GenreFilm from './Components/Body/GenreFilm'
import Login from './Components/Body/Login'
import Register from './Components/Body/Register'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  


  return (
    <div className="App">
      <div id="header-container">
        <Header />
      </div>
      <div id="body-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/danh-sach/:slug" element={<TypeFilm />} />
          <Route path="/filmDetail/:slug" element={<FilmDetail />} />
          <Route path="/watchFilm/:slug" element={<WatchFilm />} />
          <Route path="/searchFilm/:slug" element={<SearchResult />} />
          <Route path="/genre/:slug" element={<GenreFilm />} />
        </Routes>
      </div>
      <div id="footer-container">
        <Footer />
      </div>
    </div>
  );
}

export default App;