import dotenv from 'dotenv';

dotenv.config();

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ message: 'Acesso não autorizado' });
  }

  next();
};

export default apiKeyAuth;
