const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('../../models/Account')
const Favfilm = require('../../models/FavorFilm');

class FilmControllers {
  async addFavorite(req, res) {
    const { userId, filmId } = req.body;
  
    try {
      // Convert filmId to ObjectId
      const objectId = mongoose.Types.ObjectId(filmId);
  
      // Find the user by userId
      const user = await Account.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
  
      // Check if the film exists in the `Favfilm` collection
      const film = await Favfilm.findById(filmId);
      if (!film) {
        return res.status(404).json({
          message: 'Film not found'
        });
      }
  
      // Check if the film is already in the user's favoriteFilms array
      if (user.favoriteFilms.some(film => film.equals(objectId))) {
        return res.status(400).json({
          message: 'Film already in favorites'
        });
      }
  
      // Add the ObjectId to the favoriteFilms array
      user.favoriteFilms.push(objectId);
      await user.save();
  
      res.status(200).json({
        message: 'Film added to favorites',
        favoriteFilms: user.favoriteFilms
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Server error'
      });
    }
  }
  

  async getFavorties(req, res) {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId).populate('favoriteFilms'); // Populate with Film details
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ favoriteFilms: user.favoriteFilms });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async deleteFavorFilm(req, res) {
    const { userId, filmId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the film from the user's favorite list
    user.favoriteFilms = user.favoriteFilms.filter((id) => id.toString() !== filmId);
    await user.save();

    res.status(200).json({ message: 'Film removed from favorites', favoriteFilms: user.favoriteFilms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
  }
}

module.exports = new FilmControllers();