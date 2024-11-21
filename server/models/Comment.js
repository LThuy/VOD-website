const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
});

module.exports = mongoose.model('Comment', commentSchema);

