require('dotenv').config();
const path = require('path');
const app = require(path.join(__dirname, 'app'));
const { checkConnection } = require(path.join(__dirname, 'utils', 'database'));

process.on('unhandledRejection', (reason) => {
    console.error('>>> Unhandled Rejection:', reason?.message);
});

const isProd = process.env.NODE_ENV === 'production';
const PORT = isProd ? process.env.PROD_PORT : (process.env.PORT || 3000);
const HOST = isProd ? process.env.PROD_HOST : (process.env.HOST || 'localhost');

checkConnection();

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
