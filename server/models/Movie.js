const mongoose = require('mongoose');

const SeoSchema = new mongoose.Schema({
  og_type: { type: String, default: null },
  titleHead: { type: String, default: null },
  descriptionHead: { type: String, default: null },
  og_image: { type: [String], default: [] },
  og_url: { type: String, default: null },
}, { _id: false }); // Embedded document schema

const BreadCrumbSchema = new mongoose.Schema({
  name: { type: String, default: null },
  slug: { type: String, default: null },
  isCurrent: { type: Boolean, default: false },
  position: { type: Number, default: null },
}, { _id: false }); // Embedded document schema

const DataSchema = new mongoose.Schema({
  seoOnPage: { type: SeoSchema, default: {} },
  breadCrumb: { type: [BreadCrumbSchema], default: [] },
  titlePage: { type: String, default: null },
  items: { type: [mongoose.Schema.Types.Mixed], default: [] },
  params: { type: mongoose.Schema.Types.Mixed, default: {} },
  type_list: { type: String, default: null },
  APP_DOMAIN_FRONTEND: { type: String, default: null },
  APP_DOMAIN_CDN_IMAGE: { type: String, default: null },
}, { _id: false }); // Embedded document schema

const MovieDataSchema = new mongoose.Schema({
  status: { type: String, required: true },
  msg: { type: String, default: "" },
  data: { type: DataSchema, required: true },
});

const MovieData = mongoose.model('movie', MovieDataSchema, 'movie');

module.exports = MovieData;
