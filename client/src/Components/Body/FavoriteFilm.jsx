import React, { useState, useEffect } from "react";
import "../../Style/BodyCss/Profile.css";
import { Link } from "react-router-dom";

const FavoriteFilm = () => {


  return (
    <div className="profiledetail-section">
      <div className="profiledetail-container">
        <div className="profiledetail-container-grid">
          <div className="profiledetail-container-item">
            <div className="profiledetail-container-item_header">
              <h1>Favorite Film List</h1>
            </div>
            <div className="profiledetail-container-item-info">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteFilm;
