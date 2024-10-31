// ApiDetails.js
import os from 'os';
import process from 'process';
import db from '../database/connection.js';

class ApiDetails {
  static getDetails() {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const dbStatus = db.readyState === 1 ? 'Connected' : 'Disconnected';

    return {
      uptime,
      memoryUsage,
      database: dbStatus,
    };
  }
}

export default ApiDetails;
