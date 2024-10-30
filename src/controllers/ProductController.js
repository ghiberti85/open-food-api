import ProductService from '../services/ProductService.js';
import ApiDetails from '../utils/ApiDetails.js';

class ProductController {
  // Get API details
  static async getApiDetails(req, res) {
    try {
      const details = ApiDetails.getDetails();
      res.json(details);
    } catch (error) {
      console.error('Erro ao obter detalhes da API:', error.message);
      res.status(500).json({ message: 'Erro ao obter detalhes da API', error });
    }
  }

  // Create a new product
  static async createProduct(req, res) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error('Erro ao criar o produto:', error.message);
      res.status(400).json({ message: 'Erro ao criar o produto', error });
    }
  }

  // Update a product by code
  static async updateProduct(req, res) {
    const { code } = req.params;
    const data = req.body;
    try {
      const product = await ProductService.updateProduct(code, data);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      res.json(product);
    } catch (error) {
      console.error('Erro ao atualizar o produto:', error.message);
      res.status(500).json({ message: 'Erro ao atualizar o produto', error });
    }
  }

  // Delete (soft delete) a product by code
  static async deleteProduct(req, res) {
    const { code } = req.params;
    try {
      const product = await ProductService.deleteProduct(code);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      res.json(product);
    } catch (error) {
      console.error('Erro ao deletar o produto:', error.message);
      res.status(500).json({ message: 'Erro ao deletar o produto', error });
    }
  }

  // Get a product by code
  static async getProduct(req, res) {
    const { code } = req.params;
    try {
      const product = await ProductService.getProduct(code);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      res.json(product);
    } catch (error) {
      console.error('Erro ao obter o produto:', error.message);
      res.status(500).json({ message: 'Erro ao obter o produto', error });
    }
  }

  // List products with pagination
  static async listProducts(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    try {
      const products = await ProductService.listProducts(page, limit);
      res.json(products);
    } catch (error) {
      console.error('Erro ao listar os produtos:', error.message);
      res.status(500).json({ message: 'Erro ao listar os produtos', error });
    }
  }
}

// Export individual methods as named exports
export const { 
  getApiDetails, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProduct, 
  listProducts 
} = ProductController;
