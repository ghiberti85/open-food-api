import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Mock the apiKeyAuth middleware to bypass API key check for root route and enforce it otherwise
jest.mock('../src/middleware/apiKeyAuth', () => (req, res, next) => {
  if (req.path === '/' || req.headers['x-api-key'] === process.env.API_KEY) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
});

// Database connection setup before all tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up the products collection before each test
beforeEach(async () => {
  await mongoose.connection.collection('products').deleteMany({});
});

// Close the MongoDB connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Product Controller', () => {
  const apiKey = process.env.API_KEY;

  it('should get API details', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('uptime');
  });

  it('should create a new product', async () => {
    const productData = generateTestProductData();
    const response = await request(app)
      .post('/products')
      .set('x-api-key', apiKey)
      .send(productData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('code', productData.code);
  });

  it('should update a product', async () => {
    const productCode = generateRandomCode();
    await createTestProduct(productCode, 'Produto Inicial', 'draft');

    const response = await request(app)
      .put(`/products/${productCode}`)
      .set('x-api-key', apiKey)
      .send({ product_name: 'Produto Atualizado' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('product_name', 'Produto Atualizado');
  });

  it('should get a product', async () => {
    const productCode = generateRandomCode();
    await createTestProduct(productCode, 'Produto Teste', 'published');

    const response = await request(app)
      .get(`/products/${productCode}`)
      .set('x-api-key', apiKey);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('code', productCode);
  });

  it('should delete (trash) a product', async () => {
    const productCode = generateRandomCode();
    await createTestProduct(productCode, 'Produto para Deletar', 'published');

    const response = await request(app)
      .delete(`/products/${productCode}`)
      .set('x-api-key', apiKey);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'trash');
  });

  it('should get paginated list of products', async () => {
    for (let i = 0; i < 15; i++) {
      await createTestProduct(generateRandomCode(), `Produto ${i}`, 'draft');
    }

    const response = await request(app)
      .get('/products?page=1&limit=10')
      .set('x-api-key', apiKey);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(10);
  });

  it('should return 404 for non-existent product', async () => {
    const response = await request(app)
      .get('/products/nonexistent')
      .set('x-api-key', apiKey);

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 for unauthorized requests', async () => {
    const productCode = generateRandomCode();
    const response = await request(app)
      .put(`/products/${productCode}`)
      .send({ product_name: 'Unauthorized' });

    expect(response.statusCode).toBe(401);
  });
});

// Helper function to generate a random product code
function generateRandomCode() {
  return Math.floor(Math.random() * 1000000000).toString();
}

// Helper function to generate test product data
function generateTestProductData() {
  return {
    code: generateRandomCode(),
    product_name: 'Produto Novo',
    brands: 'Marca Teste',
    status: 'published',
    imported_t: new Date(),
  };
}

// Helper function to create a test product in the database
async function createTestProduct(code, name, status) {
  await request(app)
    .post('/products')
    .set('x-api-key', process.env.API_KEY)
    .send({
      code,
      product_name: name,
      brands: 'Marca Teste',
      status,
      imported_t: new Date(),
    });
}
