const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const setupSwagger = require('./swagger');

app.use(express.json());

app.use('/', productRoutes);

setupSwagger(app);

module.exports = app;
