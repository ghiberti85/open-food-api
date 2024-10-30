import express from 'express';
import productRoutes from './routes/productRoutes.js';
import setupSwagger from './swagger.js';

const app = express();

// Use JSON middleware
app.use(express.json());

// Set up routes
app.use('/', productRoutes);

// Set up Swagger
setupSwagger(app);

export default app;
