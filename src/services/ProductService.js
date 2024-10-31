// ProductService.js
import Product from '../models/Product.js';

class ProductService {
  static async createProduct(data) {
    const product = new Product(data);
    return await product.save();
  }

  static async updateProduct(code, data) {
    return await Product.findOneAndUpdate({ code }, data, { new: true });
  }

  static async deleteProduct(code) {
    return await Product.findOneAndUpdate({ code }, { status: 'trash' }, { new: true });
  }

  static async getProduct(code) {
    return await Product.findOne({ code });
  }

  static async listProducts(page, limit) {
    return await Product.find({ status: { $ne: 'trash' } })
      .skip((page - 1) * limit)
      .limit(limit);
  }
}

export default ProductService;
