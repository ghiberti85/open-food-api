require('dotenv').config();
const mongoose = require('mongoose');

// Definindo a variável uri
const uri = process.env.MONGODB_URI;

// Verificando se a variável uri está definida
if (!uri) {
  console.error('A variável MONGODB_URI não está definida no arquivo .env');
  process.exit(1);
}

// Conectando ao MongoDB
mongoose.connect(uri);

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Conectado ao MongoDB Atlas');
});

db.on('error', (err) => {
  console.error('Erro na conexão com o MongoDB:', err);
});

module.exports = mongoose;