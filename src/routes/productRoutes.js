import { Router } from 'express';
import {
  getApiDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  listProducts,
  searchProductsElastic
} from '../controllers/ProductController.js';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API details
 *     description: Retrieve API details including uptime, memory usage, and database connection status.
 *     responses:
 *       200:
 *         description: API details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: number
 *                   description: The API uptime in seconds
 *                 memoryUsage:
 *                   type: object
 *                   description: Current memory usage
 */
router.get('/', getApiDetails);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Add a new product to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               product_name:
 *                 type: string
 *               brands:
 *                 type: string
 *               categories:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, trash, published]
 *               imported_t:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 product_name:
 *                   type: string
 */
router.post('/products', createProduct);

/**
 * @swagger
 * /products/{code}:
 *   put:
 *     summary: Update a product
 *     description: Update an existing product by its unique code.
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The product code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, trash, published]
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put('/products/:code', updateProduct);

/**
 * @swagger
 * /products/{code}:
 *   delete:
 *     summary: Delete (soft delete) a product
 *     description: Change a product's status to "trash".
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The product code
 *     responses:
 *       200:
 *         description: Product soft deleted (status set to trash)
 */
router.delete('/products/:code', deleteProduct);

/**
 * @swagger
 * /products/{code}:
 *   get:
 *     summary: Retrieve a specific product
 *     description: Get details of a product by its unique code.
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The product code
 *     responses:
 *       200:
 *         description: A product object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 product_name:
 *                   type: string
 */
router.get('/products/:code', getProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List products
 *     description: Retrieve a paginated list of products.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   product_name:
 *                     type: string
 */
router.get('/products', listProducts);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search products
 *     description: Search for products by name, brand, or category using Elasticsearch.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query string
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   product_name:
 *                     type: string
 */
router.get('/search', searchProductsElastic);

export default router;
