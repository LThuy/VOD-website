const mongoose = require('mongoose');
const FavMovieSchema = require('./FavorFilm')

const AccountSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false }, // Track email verification status
  verificationToken: { type: String },
  favoriteFilms: [FavMovieSchema],
});

module.exports = mongoose.model('Account', AccountSchema);
