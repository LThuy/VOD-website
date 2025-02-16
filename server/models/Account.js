const mongoose = require('mongoose');
const FavMovieSchema = require('./FavorFilm');
const HistFilmChema = require('./HisFilm');

const SessionSchema = new mongoose.Schema({
  startTime: { type: Date, default: Date.now }, // Session start time
  endTime: { type: Date }, // Session end time
  duration: { type: Number }, // Duration in seconds
});

const AccountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
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
    default: false,
  }, // Track email verification status
  mustChangePassword: {
    type: Boolean,
    default: true,
  }, 
  verificationToken: {
    type: String,
  },
  favoriteFilms: [FavMovieSchema],
  historyFilms: [HistFilmChema],
  locked: {
    type: Boolean,
    default: false,
  },
  lastLogin: { type: Date },
  sessions: [SessionSchema], // Store session details
});

module.exports = mongoose.model('Account', AccountSchema);
