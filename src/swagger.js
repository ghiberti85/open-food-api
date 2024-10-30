import swaggerJsDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Open Food API',
      version: '1.0.0',
      description: 'API para gerenciamento de produtos do Open Food Facts',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default (app) => {
  app.use('/api-docs', serve, setup(swaggerDocs));
};
