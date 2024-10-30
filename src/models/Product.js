const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  status: { type: String, enum: ['draft', 'trash', 'published'], default: 'draft' },
  imported_t: { type: Date, default: Date.now },
  url: { type: String },
  creator: { type: String },
  created_t: { type: Number },
  last_modified_t: { type: Number },
  product_name: { type: String },
  quantity: { type: String },
  brands: { type: String },
  categories: { type: String },
  labels: { type: String },
  cities: { type: String },
  purchase_places: { type: String },
  stores: { type: String },
  ingredients_text: { type: String },
  traces: { type: String },
  serving_size: { type: String },
  serving_quantity: { type: Number },
  nutriscore_score: { type: Number },
  nutriscore_grade: { type: String },
  main_category: { type: String },
  image_url: { type: String }
});

module.exports = mongoose.model('Product', ProductSchema);
