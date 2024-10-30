const ProductService = require('../services/ProductService');
const ApiDetails = require('../utils/ApiDetails');

class ProductController {
  async getApiDetails(req, res) {
    const details = ApiDetails.getDetails();
    res.json(details);
  }

  async updateProduct(req, res) {
    const { code } = req.params;
    const data = req.body;
    try {
      const product = await ProductService.updateProduct(code, data);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar o produto', error });
    }
  }

  async deleteProduct(req, res) {
    const { code } = req.params;
    try {
      const product = await ProductService.deleteProduct(code);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar o produto', error });
    }
  }

  async getProduct(req, res) {
    const { code } = req.params;
    try {
      const product = await ProductService.getProduct(code);
      if (!product) {
        res.status(404).json({ message: 'Produto não encontrado' });
      } else {
        res.json(product);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao obter o produto', error });
    }
  }

  async listProducts(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      const products = await ProductService.listProducts(page, limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar os produtos', error });
    }
  }
}

module.exports = new ProductController();
