const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false }, // Track email verification status
  verificationToken: { type: String },
  favoriteFilms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favfilm' }]
});

module.exports = mongoose.model('Account', AccountSchema);
