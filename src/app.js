import express from 'express';
import productRoutes from './routes/productRoutes.js';
import apiKeyAuth from './middleware/apiKeyAuth.js';
import setupSwagger from './swagger.js';

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Apply API key authentication middleware globally
app.use(apiKeyAuth);

// Set up routes
app.use('/', productRoutes);

// Set up Swagger documentation
setupSwagger(app);

export default app;
