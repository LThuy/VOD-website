const mongoose = require('mongoose');

const SeoSchema = new mongoose.Schema({
  og_type: { type: String, required: true },
  titleHead: { type: String, required: true },
  descriptionHead: { type: String, required: true },
  og_image: [{ type: String }], // Array of strings for image URLs
  og_url: { type: String, required: true },
});

const BreadCrumbSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String },
  isCurrent: { type: Boolean, required: true },
  position: { type: Number, required: true },
});

const MainSchema = new mongoose.Schema({
  seoOnPage: { type: SeoSchema, required: true },
  breadCrumb: [BreadCrumbSchema], // Array of breadcrumb objects
  titlePage: { type: String, required: true },
  items: [{ type: mongoose.Schema.Types.Mixed }], // Generic array for items
  params: { type: mongoose.Schema.Types.Mixed }, // Generic object for parameters
  type_list: { type: String, required: true },
  APP_DOMAIN_FRONTEND: { type: String, required: true },
  APP_DOMAIN_CDN_IMAGE: { type: String, required: true },
});

const MovieModel = mongoose.model('movie', MainSchema, 'movie');

module.exports = MovieModel;
