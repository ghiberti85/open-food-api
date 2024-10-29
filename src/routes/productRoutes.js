const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

router.use(apiKeyAuth); // Aplica o middleware a todas as rotas abaixo


router.get('/', ProductController.getApiDetails);
router.put('/products/:code', ProductController.updateProduct);
router.delete('/products/:code', ProductController.deleteProduct);
router.get('/products/:code', ProductController.getProduct);
router.get('/products', ProductController.listProducts);

module.exports = router;