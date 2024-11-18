const mongoose = require('mongoose');

const favorfilmSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Title of the film
    description: { type: String },          // Short description of the film
    releaseDate: { type: Date },            // Release date of the film
    genres: [{ type: String }],             // Array of genres for the film
    director: [{ type: String }],           // Array of directors
    posterUrl: { type: String },            // URL to the poster image
    trailerUrl: { type: String },           // URL to the trailer
    runtime: { type: String },              // Runtime duration of the film
    language: { type: String },             // Language of the film
    cast: [{ type: String }],               // Array of actors/actresses
    quality: { type: String },              // Quality (e.g., HD, FHD)
    year: { type: Number },  
});

const Film = mongoose.model('favfilms', favorfilmSchema);
module.exports = Film;
