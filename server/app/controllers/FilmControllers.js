const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('../../models/Account')
const Favfilm = require('../../models/FavorFilm');

class FilmControllers {
  async addFavorite(req, res) {
    const {
      userId,
      filmData
    } = req.body;

    try {
      // Validate filmData and userId
      if (!userId || !filmData || !filmData._id) {
        return res.status(400).json({
          status: false,
          message: "Invalid data: userId and filmData with _id are required.",
        });
      }

      // Find the user by ID
      const user = await User.findById(userId).populate('favoriteFilms');

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found"
        });
      }

      console.log("User favorite films:", user.favoriteFilms);

      // Ensure favoriteFilms is an array and check if film already exists
      if (Array.isArray(user.favoriteFilms)) {
        const isFilmExists = user.favoriteFilms.some(
          (film) => film && film._id && film._id.toString() === filmData._id.toString()
        );

        if (isFilmExists) {
          return res.status(400).json({
            status: false,
            message: "This film is already in your favorite list.",
          });
        }
      } else {
        // If favoriteFilms is not an array, initialize it as an empty array
        user.favoriteFilms = [];
      }

      // Add the film data to the favoriteFilms array
      user.favoriteFilms.push(filmData);

      // Save the updated user document
      await user.save();

      // Send success response
      res.status(200).json({
        status: true,
        message: "Favorite film added successfully!",
        favoriteFilms: user.favoriteFilms,
      });
    } catch (error) {
      console.error("Error adding favorite film:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while adding the favorite film.",
      });
    }
  }

  // POST /film/is-favorite
  async checkFavorite(req, res) {
    const {
      userId,
      filmId
    } = req.body;

    try {
      const user = await User.findById(userId).populate('favoriteFilms');
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found"
        });
      } 

      const isFavorite = user.favoriteFilms.some(film => film._id.toString() === filmId);
      res.status(200).json({
        status: true,
        isFavorite
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error checking if the film is liked."
      });
    }
  }




  async getFavorties(req, res) {
    const userId = req.params.userId;

    try {
      // Validate userId (ensure it's a valid ObjectId)
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      // Retrieve the user with their favorite films
      const user = await User.findById(userId).select('favoriteFilms');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user's favorite films
      res.status(200).json(user.favoriteFilms);
    } catch (error) {
      console.error('Error retrieving favorite films:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async deleteFavorFilm(req, res) {
    const { userId, filmId } = req.body;
  
    try {
      // Validate inputs
      if (!userId || !filmId) {
        return res.status(400).json({
          status: false,
          message: "Invalid data: userId and filmId are required.",
        });
      }
  
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found.",
        });
      }
  
      // Check if the film exists in the user's favorite list
      const filmExists = user.favoriteFilms.some(
        (film) => film._id.toString() === filmId
      );
      if (!filmExists) {
        return res.status(404).json({
          status: false,
          message: "Film not found in the user's favorite list.",
        });
      }
  
      // Remove the film from the user's favorite list
      user.favoriteFilms = user.favoriteFilms.filter(
        (film) => film._id.toString() !== filmId
      );
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json({
        status: true,
        message: "Film removed from favorites successfully.",
        favoriteFilms: user.favoriteFilms,
      });
    } catch (error) {
      console.error("Error removing favorite film:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while removing the favorite film.",
      });
    }
  }
  
  
}

module.exports = new FilmControllers();