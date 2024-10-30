// testMongoConnection.js
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Conexão bem-sucedida com o MongoDB');
  process.exit(0);
});

db.on('error', (err) => {
  console.error('Erro na conexão com o MongoDB:', err);
  process.exit(1);
});
