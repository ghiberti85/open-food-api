const app = require('./src/app');
require('dotenv').config();
require('./src/cron/importData'); // Inicia o CRON
require('./src/database/connection'); // Conexão com o banco de dados

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
