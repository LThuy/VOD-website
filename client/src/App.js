import React, { useState } from 'react';
import { Routes, Route ,useLocation } from 'react-router-dom';
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
  const location = useLocation();


  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  
  return (
    <div className="App">
      {!isLoginPage && !isRegisterPage && (
        <div id="header-container">
          <Header />
        </div>
      )}
      
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
      {
        !isLoginPage && !isRegisterPage && (
          <div id="footer-container">
            <Footer />
          </div>
        )
      }
      
    </div>
  );
}

export default App;