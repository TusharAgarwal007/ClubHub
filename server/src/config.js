const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/clubhub',
  MONGODB_URI: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/clubhub',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_clubhub_jwt_key_2026',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@clubhub.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
