import { 
    getApiDetails, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProduct, 
    listProducts 
  } from '../controllers/ProductController.js';
  import express from 'express';
  import apiKeyAuth from '../middleware/apiKeyAuth.js';
  
  const router = express.Router();
  
  // Define routes
  router.get('/', getApiDetails);
  router.post('/products', apiKeyAuth, createProduct);
  router.put('/products/:code', apiKeyAuth, updateProduct);
  router.delete('/products/:code', apiKeyAuth, deleteProduct);
  router.get('/products/:code', getProduct);
  router.get('/products', listProducts);
  
  export default router;
  