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

// Limpa a coleção de produtos antes de cada teste
beforeEach(async () => {
  await mongoose.connection.collection('products').deleteMany({});
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

  it('should create a new product', async () => {
    const randomCode = Math.floor(Math.random() * 1000000000).toString(); // Gera um código aleatório
    const productData = {
      code: randomCode,
      product_name: 'Produto Novo',
      brands: 'Marca Teste',
      status: 'published',
      imported_t: new Date()
    };
  
    const response = await request(app)
      .post('/products')
      .set('x-api-key', apiKey)
      .send(productData);
    
    console.log('Response body:', response.body); // Log para depuração
  
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('code', randomCode);
  });
  

  it('should update a product', async () => {
    // Primeiro, cria um produto para atualizar
    const randomCode = Math.floor(Math.random() * 1000000000).toString();
    await request(app)
      .post('/products')
      .set('x-api-key', apiKey)
      .send({ code: randomCode, product_name: 'Produto Inicial', status: 'draft' });

    const response = await request(app)
      .put(`/products/${randomCode}`)
      .set('x-api-key', apiKey)
      .send({ product_name: 'Produto Atualizado' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('product_name', 'Produto Atualizado');
  });

  it('should get a product', async () => {
    const randomCode = Math.floor(Math.random() * 1000000000).toString();
    await request(app)
      .post('/products')
      .set('x-api-key', apiKey)
      .send({ code: randomCode, product_name: 'Produto Teste', status: 'published' });

    const response = await request(app).get(`/products/${randomCode}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('code', randomCode);
  });

  it('should delete (trash) a product', async () => {
    const randomCode = Math.floor(Math.random() * 1000000000).toString();
    await request(app)
      .post('/products')
      .set('x-api-key', apiKey)
      .send({ code: randomCode, product_name: 'Produto para Deletar', status: 'published' });

    const response = await request(app)
      .delete(`/products/${randomCode}`)
      .set('x-api-key', apiKey);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'trash');
  });

  it('should get paginated list of products', async () => {
    // Cria alguns produtos para a listagem paginada
    for (let i = 0; i < 15; i++) {
      await request(app)
        .post('/products')
        .set('x-api-key', apiKey)
        .send({ code: Math.floor(Math.random() * 1000000000).toString(), product_name: `Produto ${i}`, status: 'draft' });
    }

    const response = await request(app).get('/products?page=1&limit=10');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(10);
  });

  it('should return 404 for non-existent product', async () => {
    const response = await request(app).get('/products/nonexistent');
    expect(response.statusCode).toBe(404);
  });

  it('should return 401 for unauthorized requests', async () => {
    const randomCode = Math.floor(Math.random() * 1000000000).toString();
    const response = await request(app).put(`/products/${randomCode}`).send({ product_name: 'Unauthorized' });
    expect(response.statusCode).toBe(401);
  });
});
