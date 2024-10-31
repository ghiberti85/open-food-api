import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

beforeEach(() => {
  process.env.BYPASS_API_KEY = 'true'; // Bypass API key check for testing
});

describe('Search Products', () => {
  it('should return products that match the query', async () => {
    const response = await request(app).get('/search?query=Sample');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('product_name', 'Sample Product');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
});
