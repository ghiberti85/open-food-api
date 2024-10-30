import os from 'os';
import process from 'process';
import db from '../database/connection.js';

class ApiDetails {
  static getDetails() {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const lastCronExecution = 'Informação não disponível'; // Implement the last CRON execution tracking as needed
    const dbStatus = db.connection.readyState === 1 ? 'Conectado' : 'Desconectado';

    return {
      uptime,
      memoryUsage,
      lastCronExecution,
      database: dbStatus,
    };
  }
}

export default ApiDetails;
