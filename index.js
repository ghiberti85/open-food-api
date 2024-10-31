import app from './src/app.js';
import dotenv from 'dotenv';
import './src/cron/importData.js'; // Start the CRON job
import './src/database/connection.js'; // Connect to the database
import cron from 'node-cron';
import ImportService from './src/services/ImportService.js';

dotenv.config();

// Define a CRON schedule (e.g., once daily at midnight)
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 0 * * *'; // Default: Midnight every day

// Schedule the import
cron.schedule(CRON_SCHEDULE, async () => {
  console.log('Running scheduled data import job...');
  await ImportService.importData();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
