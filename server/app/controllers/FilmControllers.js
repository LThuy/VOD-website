const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('../../models/Account')
const Favfilm = require('../../models/FavorFilm');
const Film = require('../../models/Film');

class FilmControllers {

  // [GET] :get films
  async getFilms(req, res) {
    try {
      // Fetch all films from the database
      const films = await Film.find();

      // Respond with the retrieved films
      res.status(200).json({
        success: true,
        data: films,
      });
    } catch (error) {
      // Handle errors
      res.status(500).json({
        success: false,
        message: 'Error retrieving films',
        error: error.message,
      });
    }
  }
  // [GET] : Get film by ID
  async getFilmById(req, res) {
    const { filmId } = req.params; // Get filmId from URL parameter

    try {
      const film = await Film.findById(filmId); // Find film by ID

      if (!film) {
        return res.status(404).json({
          success: false,
          message: 'Film not found',
        });
      }

      res.status(200).json({
        success: true,
        data: film, // Send the film data as response
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving film',
        error: error.message,
      });
    }
  }

  // [DELETE] :delete a film
  async deleteFilm(req, res) {
    const { filmId } = req.params; 

    try {
      // Find and delete the film by its _id
      const deletedFilm = await Film.findByIdAndDelete(filmId);

      if (!deletedFilm) {
        return res.status(404).json({
          success: false,
          message: 'Film not found',
        });
      }

      // Respond with success message after deletion
      res.status(200).json({
        success: true,
        message: 'Film deleted successfully',
      });
    } catch (error) {
      // Handle errors
      res.status(500).json({
        success: false,
        message: 'Error deleting film',
        error: error.message,
      });
    }
  }
  // [PUT] : Edit film
  async editFilm(req, res) {
    const { filmId } = req.params;
    const updatedData = req.body;
    console.log(updatedData)
    try {
      const film = await Film.findByIdAndUpdate(filmId, updatedData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation occurs during the update
      });

      if (!film) {
        return res.status(404).json({
          success: false,
          message: 'Film not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Film updated successfully',
        data: film,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating film',
        error: error.message,
      });
    }
  }

  // [POST] : add favorite film
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
  
  
}

module.exports = new FilmControllers();