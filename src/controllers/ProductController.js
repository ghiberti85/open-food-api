import ProductService from '../services/ProductService.js';
import ApiDetails from '../utils/ApiDetails.js';
import { searchProducts as elasticSearchProducts } from '../services/elasticService.js';

class ProductController {
  static async getApiDetails(req, res) {
    try {
      const details = ApiDetails.getDetails();
      res.status(200).json(details);
    } catch (error) {
      console.error('Error getting API details:', error.message);
      res.status(500).json({ message: 'Error getting API details', error: error.message });
    }
  }

  static async createProduct(req, res) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error.message);
      res.status(400).json({ message: 'Error creating product', error });
    }
  }

  static async updateProduct(req, res) {
    const { code } = req.params;
    const data = req.body;
    try {
      const product = await ProductService.updateProduct(code, data);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error.message);
      res.status(500).json({ message: 'Error updating product', error });
    }
  }

  static async deleteProduct(req, res) {
    const { code } = req.params;
    try {
      const product = await ProductService.deleteProduct(code);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error deleting product:', error.message);
      res.status(500).json({ message: 'Error deleting product', error });
    }
  }

  static async getProduct(req, res) {
    const { code } = req.params;
    try {
      const product = await ProductService.getProduct(code);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error getting product:', error.message);
      res.status(500).json({ message: 'Error getting product', error });
    }
  }

  static async listProducts(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    try {
      const products = await ProductService.listProducts(page, limit);
      res.json(products);
    } catch (error) {
      console.error('Error listing products:', error.message);
      res.status(500).json({ message: 'Error listing products', error });
    }
  }

  static async searchProductsElastic(req, res) {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Missing search query.' });
    }
    try {
      const results = await elasticSearchProducts(query);
      console.log('Elasticsearch search results:', results);
      res.json(results);
    } catch (error) {
      console.error('Error searching products:', error.message);
      res.status(500).json({ message: 'Error searching products', error });
    }
  }
}

export const {
  getApiDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  listProducts,
  searchProductsElastic
} = ProductController;
