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
  role:{
    type: String,
    default: 'user'
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
  historyFilms: [HistFilmChema],
  locked: {
    type: Boolean,
    default: false
  },
  lastLogin: { type: Date },
  onlineTime: {
    type: Number,
    default: 0, // Time in milliseconds
  },
});

module.exports = mongoose.model('Account', AccountSchema);