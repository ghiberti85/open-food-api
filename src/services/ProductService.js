const Product = require('../models/Product');

class ProductService {
  async updateProduct(code, data) {
    return Product.findOneAndUpdate({ code }, data, { new: true, upsert: true });
  }

  async deleteProduct(code) {
    return Product.findOneAndUpdate({ code }, { status: 'trash' }, { new: true });
  }

  async getProduct(code) {
    return Product.findOne({ code });
  }

  async listProducts(page, limit) {
    const skip = (page - 1) * limit;
    return Product.find().skip(skip).limit(limit);
  }
}

module.exports = new ProductService();
