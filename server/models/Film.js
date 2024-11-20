const mongoose = require('mongoose');

const Film = new mongoose.Schema({
  tmdb: {
    type: { type: String, default: null },
    id: { type: String, default: null },
    season: { type: String, default: null },
    vote_average: { type: Number, default: 0 },
    vote_count: { type: Number, default: 0 },
  },
  imdb: {
    id: { type: String, default: null },
  },
  created: {
    time: { type: Date, required: true },
  },
  modified: {
    time: { type: Date, required: true },
  },
  _id: { type: String, required: true }, // Maintain the API's specific ID format
  name: { type: String, required: true },
  slug: { type: String ,unique: true },
  origin_name: { type: String },
  content: { type: String },
  type: { type: String },
  status: { type: String },
  poster_url: { type: String },
  thumb_url: { type: String },
  is_copyright: { type: Boolean, default: false },
  sub_docquyen: { type: Boolean, default: false },
  chieurap: { type: Boolean, default: false },
  trailer_url: { type: String },
  time: { type: String }, // Store as a string since it's "131 phút"
  episode_current: { type: String },
  episode_total: { type: String },
  quality: { type: String },
  lang: { type: String },
  notify: { type: String },
  showtimes: { type: String },
  year: { type: Number },
  view: { type: Number, default: 0 },
  actor: [String], // Array of actor names
  director: [String], // Array of director names
  category: [
    {
      id: { type: String },
      name: { type: String },
      slug: { type: String },
    },
  ],
  country: [
    {
      id: { type: String },
      name: { type: String },
      slug: { type: String },
    },
  ],
  episodes: [
    {
      server_name: { type: String },
      server_data: [
        {
          name: { type: String },
          slug: { type: String },
          filename: { type: String },
          link_embed: { type: String },
          link_m3u8: { type: String },
        },
      ],
    },
  ],
});

module.exports = Film;
