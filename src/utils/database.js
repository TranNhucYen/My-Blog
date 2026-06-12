const { sequelize } = require('../models');

const checkConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('>>> Database connected successfully');
    } catch (err) {
        console.error('>>> Database connection failed:', err.message);
    }
};

module.exports = { checkConnection };