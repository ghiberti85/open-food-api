import dotenv from 'dotenv';
dotenv.config();

const apiKeyAuth = (req, res, next) => {
  const validApiKey = process.env.API_KEY;
  const requestApiKey = req.headers['x-api-key'];

  // Allow access to /api-docs and /api-docs/* without API key
  if (req.path.startsWith('/api-docs') || process.env.BYPASS_API_KEY === 'true') {
    return next();
  }

  // Check for a valid API key
  if (requestApiKey && requestApiKey === validApiKey) {
    return next();
  }

  // Respond with Unauthorized if no valid API key is provided
  res.status(401).json({ message: 'Unauthorized access - invalid or missing API key' });
};

export default apiKeyAuth;
