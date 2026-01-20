// Load environment variables from .env
require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'demo_user',
        // if empty string or undefined, fallback to null so some ORMs treat it as no password
        password: process.env.DB_PASSWORD || 'demo_pass',
        database: process.env.DB_NAME || 'myblog',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false
    },

    test: {
        username: process.env.TEST_DB_USER || process.env.DB_USER || 'root',
        password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD || null,
        database: process.env.TEST_DB_NAME || process.env.DB_NAME || 'database_test',
        host: process.env.TEST_DB_HOST || process.env.DB_HOST || '127.0.0.1',
        dialect: process.env.TEST_DB_DIALECT || process.env.DB_DIALECT || 'mysql'
    },

    production: {
        username: process.env.PROD_DB_USER || process.env.DB_USER || 'root',
        password: process.env.PROD_DB_PASSWORD || process.env.DB_PASSWORD || null,
        database: process.env.PROD_DB_NAME || process.env.DB_NAME || 'database_production',
        host: process.env.PROD_DB_HOST || process.env.DB_HOST || '127.0.0.1',
        dialect: process.env.PROD_DB_DIALECT || process.env.DB_DIALECT || 'mysql'
    }
};
