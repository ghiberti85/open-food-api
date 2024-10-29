const mongoose = require('../database/connection');

const ProductSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  status: { type: String, enum: ['draft', 'trash', 'published'], default: 'draft' },
  imported_t: { type: Date, default: Date.now },
  // ... outros campos do products.json
});

module.exports = mongoose.model('Product', ProductSchema);