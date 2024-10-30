const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
require('dotenv').config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

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

  it('should update a product', async () => {
    const code = '123456789';
    const response = await request(app)
      .put(`/products/${code}`)
      .set('x-api-key', apiKey)
      .send({ product_name: 'Produto Teste' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('product_name', 'Produto Teste');
  });

  it('should get a product', async () => {
    const code = '123456789';
    const response = await request(app).get(`/products/${code}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('code', code);
  });
});
