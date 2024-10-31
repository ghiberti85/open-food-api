import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTICSEARCH_USER,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
});

/**
 * Check the Elastic Search connection status.
 */
export const checkElasticSearchConnection = async () => {
  try {
    const health = await client.cluster.health();
    console.log('Elastic Search cluster health:', JSON.stringify(health, null, 2));
  } catch (error) {
    console.error('Elastic Search connection error:', error.message);
  }
};

/**
 * Search for products in the 'products' index.
 * @param {string} query - The search query string.
 * @returns {Array} - An array of matching products or an empty array if no hits.
 */
export const searchProducts = async (query) => {
  try {
    const response = await client.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query,
            fields: ['product_name', 'brands', 'categories'],
          },
        },
      },
    });

    // Log the full response to confirm the correct structure
    console.log('Full Elastic Search response:', JSON.stringify(response, null, 2));

    const hits = response.hits?.hits; // Access hits directly from response
    if (!hits) {
      console.warn('No hits found in Elastic Search response:', JSON.stringify(response, null, 2));
      return [];
    }

    return hits.map(hit => hit._source);
  } catch (error) {
    console.error('Error during Elastic Search query:', error.message);
    return [];
  }
};

// Optional: Uncomment this line to check connection at module load if desired
// checkElasticSearchConnection();
