const mongoose = require('mongoose');
const FavMovieSchema = require('./FavorFilm')
const HistFilmChema = require('./HisFilm')

const AccountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    default: function () {
      return this.email.split('@')[0];
    },
  },
  verified: {
    type: Boolean,
    default: false
  }, // Track email verification status
  verificationToken: {
    type: String
  },
  favoriteFilms: [FavMovieSchema],
  historyFilms: [HistFilmChema]
});

module.exports = mongoose.model('Account', AccountSchema);