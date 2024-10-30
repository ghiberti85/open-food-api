const axios = require('axios');
const Product = require('../models/Product');
const readline = require('readline');
const zlib = require('zlib');

class ImportService {
  async importData() {
    try {
      // Obter a lista de arquivos
      const indexUrl = 'https://challenges.coode.sh/food/data/json/index.txt';
      const { data } = await axios.get(indexUrl);
      const files = data.trim().split('\n');

      for (const file of files) {
        try {
          const fileUrl = `https://challenges.coode.sh/food/data/json/${file}`;
          console.log(`Baixando e processando o arquivo ${fileUrl}`);

          // Fazer o download do arquivo como stream
          const response = await axios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream',
          });

          // Descomprimir o stream
          const gunzip = zlib.createGunzip();

          // Fluxo de leitura linha a linha
          const rl = readline.createInterface({
            input: response.data.pipe(gunzip),
            crlfDelay: Infinity,
          });

          let count = 0;

          for await (const line of rl) {
            if (count >= 100) break; // Limitar a 100 produtos

            try {
              const productData = JSON.parse(line);

              // Adicionar campos personalizados
              productData.imported_t = new Date();
              productData.status = 'published';

              // Salvar ou atualizar o produto no banco de dados
              await Product.updateOne(
                { code: productData.code },
                { $set: productData },
                { upsert: true }
              );

              count++;
            } catch (error) {
              console.error(`Erro ao processar uma linha do arquivo ${file}:`, error.message);
              continue;
            }
          }

          console.log(`Arquivo ${file} processado com sucesso. Total de produtos importados: ${count}`);
        } catch (error) {
          console.error(`Erro ao processar o arquivo ${file}:`, error.message);
          continue;
        }
      }

      console.log('Importação concluída com sucesso.');
    } catch (error) {
      console.error('Erro durante a importação:', error.message);
    }
  }
}

module.exports = new ImportService();
