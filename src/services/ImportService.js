import axios from 'axios';
import Product from '../models/Product.js';
import { createInterface } from 'readline';
import { createGunzip } from 'zlib';
import nodemailer from 'nodemailer';
import { client as elasticClient } from './elasticService.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class ImportService {
  async importData() {
    try {
      const indexUrl = 'https://challenges.coode.sh/food/data/json/index.txt';
      const { data } = await axios.get(indexUrl);
      const files = data.trim().split('\n');

      for (const file of files) {
        await this.processFile(file);
      }
    } catch (error) {
      console.error('Erro geral durante a importação de dados:', error.message);
      await this.sendAlert(`Erro geral durante a importação de dados: ${error.message}`);
    }
  }

  async processFile(file) {
    try {
      const fileUrl = `https://challenges.coode.sh/food/data/json/${file}`;
      console.log(`Baixando e processando o arquivo ${fileUrl}`);

      const response = await axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
      });

      const rl = createInterface({
        input: response.data.pipe(createGunzip()),
        crlfDelay: Infinity,
      });

      let count = 0;
      for await (const line of rl) {
        if (count >= 100) break; // Limit to 100 products for testing
        await this.processLine(line, file);
        count++;
      }

      console.log(`Arquivo ${file} processado com sucesso. Total de produtos importados: ${count}`);
    } catch (error) {
      console.error(`Erro ao processar o arquivo ${file}:`, error.message);
      await this.sendAlert(`Erro ao processar o arquivo ${file}: ${error.message}`);
    }
  }

  async processLine(line, file) {
    try {
      const productData = JSON.parse(line);
      productData.imported_t = new Date();
      productData.status = 'published';

      await Product.updateOne(
        { code: productData.code },
        { $set: productData },
        { upsert: true }
      );

      await elasticClient.index({
        index: 'products',
        id: productData.code,
        body: productData,
      });
    } catch (error) {
      console.error(`Erro ao processar uma linha do arquivo ${file}:`, error.message);
      await this.sendAlert(`Erro ao processar uma linha do arquivo ${file}: ${error.message}`);
    }
  }

  async sendAlert(message) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: 'Alerta de Falha no CRON de Importação',
      text: message,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Alerta de falha enviado por e-mail.');
    } catch (error) {
      console.error('Falha ao enviar o alerta de e-mail:', error.message);
    }
  }
}

export default new ImportService();