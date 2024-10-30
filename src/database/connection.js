import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Extract connect and connection from mongoose
const { connect, connection } = mongoose;

// Define the MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

// Check if the URI is defined
if (!uri) {
  console.error('A variável MONGODB_URI não está definida no arquivo .env');
  process.exit(1);
}

// Connect to MongoDB without deprecated options
connect(uri)
  .then(() => {
    console.log('Conectado ao MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Erro na conexão com o MongoDB:', err.message);
    process.exit(1);
  });

// Handle connection error events
connection.on('error', (err) => {
  console.error('Erro na conexão com o MongoDB:', err);
});

// Export the connection for use in other modules
export default connection;
