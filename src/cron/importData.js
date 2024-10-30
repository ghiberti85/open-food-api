import ImportService from '../services/ImportService.js';
import { schedule } from 'node-cron';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Schedule the data import job
schedule(process.env.CRON_SCHEDULE, () => {
  console.log('Iniciando importação de dados...');
  ImportService.importData();
});
