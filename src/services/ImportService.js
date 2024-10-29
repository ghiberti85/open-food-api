const axios = require('axios');
const Product = require('../models/Product');

module.exports = {
  importData: async () => {
    try {
      // Obter a lista de arquivos
      const { data } = await axios.get('https://challenges.coode.sh/food/data/json/index.txt');
      const files = data.trim().split('\n');

      for (const file of files) {
        const fileUrl = `https://challenges.coode.sh/food/data/json/${file}`;
        const response = await axios.get(fileUrl);
        const products = response.data.products.slice(0, 100); // Limitar a 100 produtos

        for (const productData of products) {
          // Adicionar campos personalizados
          productData.imported_t = new Date();
          productData.status = 'published';

          // Salvar ou atualizar o produto no banco de dados
          await Product.updateOne(
            { code: productData.code },
            { $set: productData },
            { upsert: true }
          );
        }
      }

      console.log('Importação concluída com sucesso.');
    } catch (error) {
      console.error('Erro durante a importação:', error);
      // Implementar registro de histórico de importações e tratamento de erros
    }
  },
};
