const os = require('os');
const process = require('process');
const db = require('../database/connection');

class ApiDetails {
  static getDetails() {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const lastCronExecution = 'Informação não disponível'; // Você pode implementar o registro da última execução do CRON
    const dbStatus = db.connection.readyState === 1 ? 'Conectado' : 'Desconectado';

    return {
      uptime,
      memoryUsage,
      lastCronExecution,
      database: dbStatus,
    };
  }
}

module.exports = ApiDetails;
