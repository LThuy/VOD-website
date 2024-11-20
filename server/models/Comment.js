const mongoose = require('mongoose');

// Assuming you have the Account model imported here
const Account = require('./Account'); // Make sure to import the Account model

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account', // Reference to the Account model
    required: true,
  },
  filmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Film', 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Comment', commentSchema);
