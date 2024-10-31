// apiKeyAuth.test.js
import request from 'supertest';
import app from '../src/app.js';

describe('API Key Authentication', () => {
  beforeEach(() => {
    // Set environment variables for each test
    process.env.API_KEY = 'test-key';
  });

  afterEach(() => {
    // Reset environment variables to avoid cross-test interference
    process.env.BYPASS_API_KEY = 'true';
  });

  it('should allow access without API key when BYPASS_API_KEY is true', async () => {
    process.env.BYPASS_API_KEY = 'true';
    const response = await request(app).get('/products');
    expect(response.statusCode).not.toBe(401); // Bypass mode should allow access
  });

  it('should deny access without API key when BYPASS_API_KEY is false', async () => {
    process.env.BYPASS_API_KEY = 'false'; // Enforce auth check
    const response = await request(app).get('/products');
    expect(response.statusCode).toBe(401); // Expect Unauthorized
  });

  it('should allow access with correct API key when BYPASS_API_KEY is false', async () => {
    process.env.BYPASS_API_KEY = 'false';
    const response = await request(app).get('/products').set('x-api-key', process.env.API_KEY);
    expect(response.statusCode).toBe(200); // Auth check passes with correct key
  });
});
