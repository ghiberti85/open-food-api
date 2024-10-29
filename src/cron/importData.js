const cron = require('node-cron');
const ImportService = require('../services/ImportService');
require('dotenv').config();

cron.schedule(process.env.CRON_SCHEDULE, () => {
  console.log('Iniciando importação de dados...');
  ImportService.importData();
});
