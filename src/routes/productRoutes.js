const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retorna detalhes da API
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.get('/', ProductController.getApiDetails);

/**
 * @swagger
 * /products/{code}:
 *   put:
 *     summary: Atualiza um produto
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do produto
 *     responses:
 *       200:
 *         description: Produto atualizado
 */

router.post('/products', apiKeyAuth, ProductController.createProduct);

/**
 * @swagger
 * /products/{code}:
 *   put:
 *     summary: Atualiza um produto
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do produto
 *     responses:
 *       200:
 *         description: Produto atualizado
 */

router.put('/products/:code', apiKeyAuth, ProductController.updateProduct);

/**
 * @swagger
 * /products/{code}:
 *   delete:
 *     summary: Deleta (altera status) um produto
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do produto
 *     responses:
 *       200:
 *         description: Produto deletado
 */
router.delete('/products/:code', apiKeyAuth, ProductController.deleteProduct);

/**
 * @swagger
 * /products/{code}:
 *   get:
 *     summary: Obtém um produto
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do produto
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.get('/products/:code', ProductController.getProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista produtos
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de itens por página
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.get('/products', ProductController.listProducts);

module.exports = router;
