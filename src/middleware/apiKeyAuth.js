import dotenv from 'dotenv';
dotenv.config();

const apiKeyAuth = (req, res, next) => {
  const validApiKey = process.env.API_KEY;
  const requestApiKey = req.headers['x-api-key'];

  // Bypass API key check for /api-docs routes or if BYPASS_API_KEY is set to true
  if (req.path.startsWith('/api-docs') || process.env.BYPASS_API_KEY === 'true') {
    return next();
  }

  // Check if API key matches
  if (requestApiKey && requestApiKey === validApiKey) {
    return next();
  }

  // Unauthorized response if API key is missing or invalid
  res.status(401).json({ message: 'Unauthorized access - invalid or missing API key' });
};

export default apiKeyAuth;
