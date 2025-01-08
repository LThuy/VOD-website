const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('../../models/Account')
const Favfilm = require('../../models/FavorFilm');
const Film = require('../../models/Film');

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
  // history film section
  async addHistory(req, res) {
    const { userId, filmData } = req.body;
  
    try {
      // Validate userId and filmData
      if (!userId || !filmData || !filmData._id) {
        return res.status(400).json({
          status: false,
          message: "Invalid data: userId and filmData with _id are required.",
        });
      }
  
      // Find the user by ID
      const user = await User.findById(userId).populate('historyFilms');
  
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }
  
      // Check if the film already exists in the historyFilms array
      const isFilmExists = user.historyFilms.some(
        (film) => film._id.toString() === filmData._id.toString()
      );
  
      if (isFilmExists) {
        return res.status(400).json({
          status: false,
          message: "This film has already been added to the history.",
        });
      }
  
      // Add the film to the historyFilms array
      user.historyFilms.push(filmData);
  
      // Save the updated user document
      await user.save();
  
      // Send success response
      res.status(200).json({
        status: true,
        message: "Film added to history successfully!",
        historyFilms: user.historyFilms,
      });
    } catch (error) {
      console.error("Error adding history film:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while adding the film to history.",
      });
    }
  }
  
  async getHistoryFilm(req, res) {
    const userId = req.params.userId;

    try {
      // Validate userId (ensure it's a valid ObjectId)
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      // Retrieve the user with their favorite films
      const user = await User.findById(userId).select('historyFilms');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user's favorite films
      res.status(200).json(user.historyFilms);
    } catch (error) {
      console.error('Error retrieving favorite films:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  //Get New Film
  async getNewestFilm(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query; // Get pagination parameters
  
      // Retrieve films from the database with pagination
      const films = await Film.find()
        .skip((page - 1) * limit) // Skipping the documents for pagination
        .limit(limit) // Limiting the number of films returned
        .exec();
  
      // Get the total number of films for pagination
      const totalFilms = await Film.countDocuments();
  
      // Format the response
      const response = {
        status: true,
        items: films.map(film => ({
          _id: film._id,
          name: film.name,
          slug: film.slug,
          origin_name: film.origin_name,
          poster_url: film.poster_url,
          thumb_url: film.thumb_url,
          year: film.year,
        })),
        pagination: {
          totalItems: totalFilms,
          totalItemsPerPage: limit,
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalFilms / limit),
        },
      };
  
      // Return the formatted response
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: 'Error retrieving films' });
    }
  }
  
  //Get Film Detail
  async getFilmDetails(req, res) {
    try {
      // Extract slug from the request parameters
      const { slug } = req.params;
      console.log(slug)
  
      // Find the film by slug in the database
      const film = await Film.findOne({ "slug" : slug });
  
      // If film not found, return a 404 response
      if (!film) {
        return res.status(404).json({ status: false, message: 'Film not found' });
      }
  
      // Return the entire film document
      res.json(film);
    } catch (error) {
      console.error('Error fetching film by slug:', error);
      res.status(500).json({ status: false, message: 'Server error' });
    }
  }
  
}

module.exports = new FilmControllers();