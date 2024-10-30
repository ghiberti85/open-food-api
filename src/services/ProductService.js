import Product from '../models/Product.js';

class ProductService {
  // Create a new product
  async createProduct(data) {
    const newProduct = new Product(data);
    return await newProduct.save();
  }

  // Update a product by code
  async updateProduct(code, data) {
    return await Product.findOneAndUpdate(
      { code },
      data,
      { new: true, upsert: true }
    );
  }

  // Soft delete a product by setting its status to 'trash'
  async deleteProduct(code) {
    return await Product.findOneAndUpdate(
      { code },
      { status: 'trash' },
      { new: true }
    );
  }

  // Get a product by code
  async getProduct(code) {
    return await Product.findOne({ code });
  }

  // List products with pagination
  async listProducts(page, limit) {
    const skip = (page - 1) * limit;
    return await Product.find().skip(skip).limit(limit);
  }
}

export default new ProductService();
