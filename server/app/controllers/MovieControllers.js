const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Movie = require('../../models/Movie')

class MovieControllers {
    async getMovies(req, res) {
        try {
            const movies = await Movie.find();
            res.send(movies);
          } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
          }
    }

    async getMoviesCount(req, res) {
      try {
          const count = await Movie.countDocuments();
          res.json({ count });
      } catch (error) {
          res.status(500).json({ message: 'Error fetching movie count', error });
      }
  }
}

module.exports = new MovieControllers();