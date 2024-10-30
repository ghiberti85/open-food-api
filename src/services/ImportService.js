import axios from 'axios'; // Use default import for axios
import Product from '../models/Product.js'; // Use default import for Product
import { createInterface } from 'readline';
import { createGunzip } from 'zlib';
import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // Set to true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class ImportService {
  async importData() {
    try {
      const indexUrl = 'https://challenges.coode.sh/food/data/json/index.txt';
      const { data } = await axios.get(indexUrl); // Use axios.get instead of named import
      const files = data.trim().split('\n');

      for (const file of files) {
        try {
          const fileUrl = `https://challenges.coode.sh/food/data/json/${file}`;
          console.log(`Baixando e processando o arquivo ${fileUrl}`);

          // Download file as stream
          const response = await axios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream',
          });

          // Decompress the stream
          const gunzip = createGunzip();

          // Line-by-line reading stream
          const rl = createInterface({
            input: response.data.pipe(gunzip),
            crlfDelay: Infinity,
          });

          let count = 0;

          for await (const line of rl) {
            if (count >= 100) break; // Limit to 100 products

            try {
              const productData = JSON.parse(line);

              // Add custom fields
              productData.imported_t = new Date();
              productData.status = 'published';

              // Save or update product in the database
              await Product.updateOne(
                { code: productData.code },
                { $set: productData },
                { upsert: true }
              );

              count++;
            } catch (error) {
              console.error(`Erro ao processar uma linha do arquivo ${file}:`, error.message);
              await this.sendAlert(`Erro ao processar uma linha do arquivo ${file}: ${error.message}`);
              continue;
            }
          }

          console.log(`Arquivo ${file} processado com sucesso. Total de produtos importados: ${count}`);
        } catch (error) {
          console.error(`Erro ao processar o arquivo ${file}:`, error.message);
          await this.sendAlert(`Erro ao processar o arquivo ${file}: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Erro geral durante a importação de dados:', error.message);
      await this.sendAlert(`Erro geral durante a importação de dados: ${error.message}`);
    }
  }

  // Method to send email alerts
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
